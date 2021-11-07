import { commands, ExtensionContext, Terminal, window } from 'vscode';
import { runArchetypeFlow } from './archetypeInputFlow';

let terminal: Terminal | undefined = undefined;

export function activate(context: ExtensionContext) {
	context.subscriptions.push(commands.registerCommand('mule.projManager.createProj', async () => {
		// const options: { [key: string]: (context: ExtensionContext) => Promise<void> } = {
		// 	multiStepInput
		// };
		// const quickPick = window.createQuickPick();
		// quickPick.items = Object.keys(options).map(label => ({ label }));
		// quickPick.onDidChangeSelection(selection => {
		// 	if (selection[0]) {
		// 		options[selection[0].label](context)
		// 			.catch(console.error);
		// 	}
		// });
		// quickPick.onDidHide(() => quickPick.dispose());
		// quickPick.show();

		if (!terminal)
			terminal = window.createTerminal(`Mule Project Manager`);

		runArchetypeFlow(context, terminal);
	}));
}
