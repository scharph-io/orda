package build

var (
	version string
	time    string
	build   string
)

func GetVersion() string {
	return version
}

func GetTime() string {
	return time
}

func GetBuild() string {
	return build
}
