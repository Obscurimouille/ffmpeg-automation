import ffmpeg from "fluent-ffmpeg";
import pathToFfmpeg from "ffmpeg-static";
import readline from "readline";
import fs from "fs";

if (!pathToFfmpeg) {
	throw new Error("Could not find FFmpeg executable");
}

ffmpeg.setFfmpegPath(pathToFfmpeg);

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

const inputVideoPath = "./media/input.mp4";
const outputDirectory = "./media/output/";
const segmentDuration = 100; // Duration of each segment in seconds

// Ensure the output directory exists
if (!fs.existsSync(outputDirectory)) {
	fs.mkdirSync(outputDirectory, { recursive: true });
}

// Ensure the input file exists
if (!fs.existsSync(inputVideoPath)) {
    console.error("Error: Input file does not exist");
    process.exit(1);
}

rl.question("Press Enter to start the FFmpeg process...\n", () => {
	rl.close();
	run();
});

const run = () => {
	console.log("Starting conversion...");

	// Calculate the total duration of the input video
	ffmpeg.ffprobe(inputVideoPath, (err, metadata) => {
		if (err) {
			console.error("Error:", err);
			return;
		}

		const totalDuration = metadata.format.duration;

		if (!totalDuration) {
			console.error("Error: Could not determine the duration of the input video");
			return;
		}

		// Calculate the number of segments
		const numSegments = Math.ceil(totalDuration / segmentDuration);

		// Generate FFmpeg commands to split the video
		for (let i = 0; i < numSegments; i++) {
			const startTime = i * segmentDuration;
			const outputSegmentPath = `${outputDirectory}vid_${i + 1}.mp4`;

			ffmpeg()
				.input(inputVideoPath)
				.inputOptions([`-ss ${startTime}`, "-t " + segmentDuration])
				.output(outputSegmentPath)
				.on("progress", (progress) => {
					const percentage = progress.percent.toFixed(2);
					console.log(`Segment ${i + 1} progress: ${percentage}%`);
				})
				.on("end", () => {
					console.log(`Segment ${i + 1} finished`);
				})
				.on("error", (err) => {
					console.error(`Error processing segment ${i + 1}:`, err);
				})
				.run();
		}
	});
};
