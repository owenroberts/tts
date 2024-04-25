// node tts/speech.js scripts/jesus_time_machine_3.txt dog Bruce cat Kathy


const fs = require('fs');
const say = require('say');
var sox = require('sox');
const program = require('commander');
program.version('0.0.1')
	.usage('<word>')
	.parse(process.argv);

const scriptPath = program.args[0];
const lines = fs.readFileSync(`${scriptPath}`)
	.toString()
	.split('\n')
	.filter(line => line.includes(':'));

const characters = {
	"dog": "Bruce",
	"cat": "Kathy",
	"bird1": "Kathy",
	"bird2": "Bruce",
}; // defaults

const scriptName = scriptPath.split('/').pop().replace('.txt', '');
const dir = `edit/${scriptName}`;

if (!fs.existsSync(dir)){
	fs.mkdirSync(dir);
}

if (!fs.existsSync(dir + '/audio')){
	fs.mkdirSync(dir + '/audio');
}

for (let i = 1; i < program.args.length; i += 2) {
	const name = program.args[i];
	const voice = program.args[i+1];
	characters[name] = [voice];
}

let lineIndex = 0;
function saveLine() {
	const line = lines[lineIndex];
	const [name, text] = line.split(": ");
	const voice = characters[name];
	let speed = 1;
	// if (name.includes('bird')) speed = 1;
	// if (voice === 'Kathy') speed = 0.75;
	// const f = `${lineIndex}-${name}.wav`;
	const f = `${dir}/audio/${lineIndex}-${name}.wav`;
	say.export(`${text} . `, voice, speed, f, err => {
		if (err) return console.error('export err', err);
		// let n = lineNumber;
		console.log(`Saved ${f}`);
		lineIndex++;
		if (lineIndex < lines.length) saveLine();

	});
}
saveLine();
