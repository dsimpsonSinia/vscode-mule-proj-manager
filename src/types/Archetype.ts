import { QuickPickItem } from "vscode";

export interface ArchetypeDefinition extends QuickPickItem {
	archetypeGroupId: string,
	archetypeArtifactId: string,
	inputFields: ArchetypeInputFields
}

export interface ArchetypeInputFields {
	[fieldName: string]: {
		defaultValue: string,
		description: string,
		options?: string[]
	}
}

export interface ArchetypeInputValues extends ArchetypeInputFields {
	[fieldName: string]: ArchetypeInputValue
}

export interface ArchetypeInputValue {
	defaultValue: string,
	description: string,
	options?: string[],
	value?: string
}