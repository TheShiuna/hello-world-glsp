/********************************************************************************
 * Copyright (c) 2022 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/
import {
    Command,
    CommandContribution,
    CommandRegistry,
    MenuContribution,
    MenuModelRegistry,
    nls
} from '@theia/core';
import {
    CommonCommands,
    CommonMenus,
    KeybindingContribution,
    KeybindingRegistry,
    LabelProvider,
    OpenerService,
    open
} from '@theia/core/lib/browser';
import { UserWorkingDirectoryProvider } from '@theia/core/lib/browser/user-working-directory-provider';
import { FileService } from '@theia/filesystem/lib/browser/file-service';
import { FileSystemUtils } from '@theia/filesystem/lib/common';
import { FileStat } from '@theia/filesystem/lib/common/files';

import isValidFilename from 'valid-filename';
import { inject, injectable } from 'inversify';

import { PokemonApiEditorDialogFactory } from './pokemon-api-editor-dialog';

export namespace PokemonApiEditorCommands {
    export const NEW_FILE = Command.toDefaultLocalizedCommand({
        id: 'pokemonEditor.action.files.newFile',
        category: CommonCommands.FILE_CATEGORY,
        label: 'New Pokemon File'
    });
}

@injectable()
export class PokemonApiEditorCommandContribution implements CommandContribution {

    constructor(
        @inject(PokemonApiEditorDialogFactory)
        private readonly pokemonApiEditorDialogFactory: PokemonApiEditorDialogFactory,
        @inject(FileService)
        private readonly fileService: FileService,
        @inject(UserWorkingDirectoryProvider)
        protected readonly workingDirProvider: UserWorkingDirectoryProvider,
        @inject(LabelProvider)
        protected readonly labelProvider: LabelProvider,
        @inject(OpenerService)
        protected readonly openerService: OpenerService
    ) { }

    registerCommands(commandRegistry: CommandRegistry): void {
        commandRegistry.registerCommand(PokemonApiEditorCommands.NEW_FILE, {
            execute: () => this.launchNewPokemonFileDialog()
        });
    }

    protected async launchNewPokemonFileDialog(): Promise<void> {
        const userWorkingDir = await this.workingDirProvider.getUserWorkingDir();
        const userWorkingDirFileStat = await this.fileService.resolve(userWorkingDir);
        const { fileName, fileExtension } = this.getDefaultFileConfig();

        const targetUri = userWorkingDir.resolve(fileName + fileExtension);
        const vacantChildUri = FileSystemUtils.generateUniqueResourceURI(userWorkingDirFileStat, targetUri, false);

        const dialog = this.pokemonApiEditorDialogFactory(
            {
                title: nls.localizeByDefault('New Pokemon File'),
                parentUri: userWorkingDir,
                initialValue: vacantChildUri.path.base,
                validate: (name: string) => this.validateFileName(name, userWorkingDirFileStat, true)
            },
            this.labelProvider
        );

        dialog.open()
            .then(async name => {
                if (name) {
                    const fileUri = userWorkingDir.resolve(name);
                    await this.fileService.create(fileUri, '[]');
                    open(this.openerService, fileUri);
                }
            });
    }

    protected getDefaultFileConfig(): { fileName: string, fileExtension: string } {
        return {
            fileName: 'Untitled',
            fileExtension: '.pokemon'
        };
    }

    protected async validateFileName(name: string, parent: FileStat, allowNested?: boolean): Promise<string> {
        if (!name) {
            return '';
        }
        if (!name.endsWith('.pokemon')) {
            return nls.localizeByDefault('Your file name must end by .pokemon extension');
        }
        // do not allow recursive rename
        if (!allowNested && !isValidFilename(name)) {
            return nls.localizeByDefault('The name **{0}** is not valid as a file or folder name. Please choose a different name.');
        }
        if (name.startsWith('/')) {
            return nls.localizeByDefault('A file or folder name cannot start with a slash.');
        } else if (name.startsWith(' ') || name.endsWith(' ')) {
            return nls.localizeByDefault('Leading or trailing whitespace detected in file or folder name.');
        }
        // check and validate each sub-paths
        if (name.split(/[\\/]/).some(file => !file || !isValidFilename(file) || /^\s+$/.test(file))) {
            return nls.localizeByDefault('\'{0}\' is not a valid file name', name);
        }
        const childUri = parent.resource.resolve(name);
        const exists = await this.fileService.exists(childUri);
        if (exists) {
            return nls.localizeByDefault(
                'A file or folder **{0}** already exists at this location. Please choose a different name.', name
            );
        }
        return '';
    }
}

@injectable()
export class PokemonApiEditorKeybindingContribution implements KeybindingContribution {
    registerKeybindings(keybindings: KeybindingRegistry): void {
        keybindings.registerKeybinding({
            command: PokemonApiEditorCommands.NEW_FILE.id,
            keybinding: 'alt+shift+p'
        });
    }
}

@injectable()
export class PokemonApiEditorMenuContribution implements MenuContribution {
    registerMenus(registry: MenuModelRegistry): void {
        registry.registerMenuAction(CommonMenus.FILE, {
            commandId: PokemonApiEditorCommands.NEW_FILE.id,
            order: '1_new_file_pokemon'
        });
    }
}
