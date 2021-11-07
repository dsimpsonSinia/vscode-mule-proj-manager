import { ArchetypeDefinition, ArchetypeInputValues } from "../types/Archetype";


export function buildCommand(archetype: ArchetypeDefinition, inputs: ArchetypeInputValues) {

	let inputsCmd = "";

	for (let inputKey in inputs) {
		let input = inputs[inputKey];

		if (input.value) {
			inputsCmd = `${inputsCmd}-D${inputKey}=${input.value} `;
		}
	}

	return `mvn archetype:generate -DarchetypeGroupId=${archetype.archetypeGroupId} -DarchetypeArtifactId=${archetype.archetypeArtifactId} ${inputsCmd}`;
}