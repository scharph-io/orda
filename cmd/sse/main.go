// main.go
package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"
)

type Message struct {
	ID        int    `json:"id"`
	Timestamp string `json:"timestamp"`
	Text      string `json:"text"`
}

func sseHandler(w http.ResponseWriter, r *http.Request) {
	// Set the headers necessary for SSE
	w.Header().Set("Content-Type", "text/event-stream")
	w.Header().Set("Cache-Control", "no-cache")
	w.Header().Set("Connection", "keep-alive")

	// Hijack the connection’s flusher
	flusher, ok := w.(http.Flusher)
	if !ok {
		http.Error(w, "Streaming unsupported", http.StatusInternalServerError)
		return
	}

	// Send a comment to keep the connection alive every 30s
	keepAlive := time.NewTicker(30 * time.Second)
	defer keepAlive.Stop()

	// Send numbered events every second
	ticker := time.NewTicker(1 * time.Second)
	defer ticker.Stop()

	counter := 1
	for {
		select {
		case <-r.Context().Done():
			// Client disconnected
			log.Println("Client closed connection")
			return

		case <-keepAlive.C:
			// Send a comment line (": keep-alive\n\n")
			fmt.Fprintf(w, ": keep-alive\n\n")
			flusher.Flush()

		case t := <-ticker.C:
			msg := Message{
				ID:        counter,
				Timestamp: t.Format(time.RFC3339),
				Text:      fmt.Sprintf("This is event #%d", counter),
			}
			data, err := json.Marshal(msg)
			if err != nil {
				log.Printf("json error: %v\n", err)
				continue
			}

			// SSE format: id, event (optional), data, then blank line
			fmt.Fprintf(w, "id: %d\n", counter)
			fmt.Fprintf(w, "data: %s\n\n", data)

			flusher.Flush()
			counter++
		}
	}
}

func main() {
	http.HandleFunc("/events", sseHandler)
	http.Handle("/", http.FileServer(http.Dir("./static"))) // serve client page
	log.Println("Starting server on http://localhost:8080 …")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Fatalf("Server failed: %v", err)
	}
}
