import { QuickPickItem, ExtensionContext, Terminal } from 'vscode';
import { MultiStepInput } from "./utils/multiStepProcess";
import { processArchetypes } from "./utils/processArchetypes";
import { ArchetypeDefinition, ArchetypeInputValues, ArchetypeInputValue } from "./types/Archetype";
import { buildCommand } from './utils/terminalCommandUtil';

let archetypes: ArchetypeDefinition[] = [];

export async function runArchetypeFlow(context: ExtensionContext, terminal: Terminal) {

	archetypes = await processArchetypes(context);

	const state = {} as Partial<State>;

	await MultiStepInput.run(input => pickArchetype(input, state));

	// convert the inputs to a command for the terminal
	let terminalCmd = "echo 'Something went wrong, missing archetype or inputs'";
	if (state.archetype && state.inputs)
		terminalCmd = buildCommand(state.archetype, state.inputs);

	// run the command in the terminal
	terminal.show();
	terminal.sendText(terminalCmd);
}

interface State {
	step: number;
	totalSteps: number;

	archetype: ArchetypeDefinition;
	inputs: ArchetypeInputValues;

	resourceGroup: QuickPickItem | string;
	name: string;
	runtime: QuickPickItem;
}

const title = 'Create Mule 4 Project';

async function pickArchetype(input: MultiStepInput, state: Partial<State>) {
	const pick = await input.showQuickPick({
		title,
		step: 1,
		totalSteps: 4,
		placeholder: 'Pick an archetype',
		items: archetypes,
		shouldResume: shouldResume
	});
	state.archetype = <ArchetypeDefinition>pick;
	return (input: MultiStepInput) => processArchetypeInputs(input, state);
}

async function processArchetypeInputs(input: MultiStepInput, state: Partial<State>) {

	// initialize the inputs if this is the first loop
	if (!state.inputs)
		state.inputs = {};

	// the next input is equal to the current length (one is 0-indexed, the other is not)
	let nextInputIndex = Object.keys(state.inputs).length;

	// find the next item in the array
	let nextInputFieldKey = Object.keys(state.archetype!.inputFields)[nextInputIndex];
	let nextInputField = state.archetype?.inputFields[nextInputFieldKey];

	// run if there is another item, otherwise we are done
	if (nextInputFieldKey && nextInputField) {
		let inputFieldValue: ArchetypeInputValue = nextInputField;
		inputFieldValue.value = await input.showInputBox({
			title,
			step: nextInputIndex + 1,
			totalSteps: Object.keys(state.archetype!.inputFields).length + 1,
			value: nextInputField.defaultValue || '',
			prompt: `${nextInputFieldKey}: ${nextInputField.description}`,
			validate: validateNameIsUnique,
			shouldResume: shouldResume
		});

		// add this new value to the state object
		state.inputs[nextInputFieldKey] = inputFieldValue;

		// loop to the next input field
		return (input: MultiStepInput) => processArchetypeInputs(input, state);
	}
}

function shouldResume() {
	// Could show a notification with the option to resume.
	return new Promise<boolean>((resolve, reject) => {
		// noop
	});
}

async function validateNameIsUnique(name: string) {
	// always valid (for now)
	return undefined;
}


