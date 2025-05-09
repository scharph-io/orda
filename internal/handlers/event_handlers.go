package handlers

import (
	"bufio"
	"bytes"
	"fmt"
	"html/template"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/valyala/fasthttp"
)

type OrdaEvents struct {
	queue []string
}

func NewOrdaEvents() *OrdaEvents {
	return &OrdaEvents{
		queue: make([]string, 0),
	}
}

func (e *OrdaEvents) TestHandler(c *fiber.Ctx) error {
	c.Set("Content-Type", "text/event-stream")
	c.Set("Cache-Control", "no-cache")
	c.Set("Connection", "keep-alive")
	c.Set("Transfer-Encoding", "chunked")

	c.Status(fiber.StatusOK).Context().SetBodyStreamWriter(fasthttp.StreamWriter(func(w *bufio.Writer) {
		var i int
		for {
			i++

			var msg string

			// if there are messages that have been sent to the `/publish` endpoint
			// then use these first, otherwise just send the current time
			if len(e.queue) > 0 {
				msg = fmt.Sprintf("%d - message recieved: %s", i, e.queue[0])
				// remove the message from the buffer
				e.queue = e.queue[1:]
			} else {
				msg = fmt.Sprintf("%d - the time is %v", i, time.Now())
			}

			fmt.Fprintf(w, "data: Message: %s\n\n", msg)
			// fmt.Println(msg)

			err := w.Flush()
			if err != nil {
				// Refreshing page in web browser will establish a new
				// SSE connection, but only (the last) one is alive, so
				// dead connections must be closed here.
				fmt.Printf("Error while flushing: %v. Closing http connection.\n", err)

				break
			}
			time.Sleep(2 * time.Second)
		}
	}))

	return nil
}

func (e *OrdaEvents) Publish(c *fiber.Ctx) error {
	type Message struct {
		Message string `json:"message"`
	}

	payload := new(Message)

	if err := c.BodyParser(payload); err != nil {
		return c.Status(fiber.StatusBadRequest).SendString(err.Error())
	}

	e.queue = append(e.queue, payload.Message)

	return c.SendString("Message added to queue\n")
}

func (e *OrdaEvents) Index(c *fiber.Ctx) error {
	// index is the HTML template that will be served to the client on the index page (`/`)
	const index = `<!DOCTYPE html>
		<html>
		<body>

		<h1>SSE Messages</h1>
		<div id="result"></div>

		<script>
		if(typeof(EventSource) !== "undefined") {
		  var source = new EventSource("http://127.0.0.1:{{.Port}}/events/sse", {withCredentials: true});
		  source.onmessage = function(event) {
		    document.getElementById("result").innerHTML += event.data + "<br>";
		  };
		} else {
		  document.getElementById("result").innerHTML = "Sorry, your browser does not support server-sent events...";
		}
		</script>

		</body>
		</html>
		`

	c.Response().Header.SetContentType(fiber.MIMETextHTMLCharsetUTF8)

	tpl, err := template.New("index").Parse(index)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).SendString(err.Error())
	}

	data := struct {
		Port string
	}{
		Port: "3000",
	}

	buf := new(bytes.Buffer)
	err = tpl.Execute(buf, data)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).SendString(err.Error())
	}

	return c.Status(fiber.StatusOK).Send(buf.Bytes())
}
