import { ExtensionContext, Uri } from 'vscode';
import * as fs from 'fs';
import * as utils from 'util';
import { ArchetypeDefinition } from "../types/Archetype";

let readFilePromise = utils.promisify(fs.readFile);

export const processArchetypes = async (context: ExtensionContext) => {
    let archetypesFile = Uri.file(context.asAbsolutePath('resources/settings/archetypes.json'));

    let archetypesContents = await readFilePromise(archetypesFile.fsPath);

    let archetypeDefinitions = JSON.parse(archetypesContents.toString()).archetypes as ArchetypeDefinition[];

    return archetypeDefinitions;
}

