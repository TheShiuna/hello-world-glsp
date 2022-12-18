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
import { codiconArray, LabelProvider, SingleTextInputDialog, SingleTextInputDialogProps } from '@theia/core/lib/browser';
import URI from '@theia/core/lib/common/uri';
import { inject, injectable } from 'inversify';

export const PokemonApiEditorDialogFactory = Symbol('PokemonApiEditorDialogFactory');
export interface PokemonApiEditorDialogFactory {
    (props: PokemonApiEditorDialogProps, labelProvider: LabelProvider): PokemonApiEditorDialog;
}

@injectable()
export class PokemonApiEditorDialogProps extends SingleTextInputDialogProps {
    /**
     * The parent `URI` for the selection present in the explorer.
     * Used to display the path in which the file/folder is created at.
     */
    parentUri: URI;
}

export class PokemonApiEditorDialog extends SingleTextInputDialog {

    constructor(
        @inject(PokemonApiEditorDialogProps)
        protected override readonly props: PokemonApiEditorDialogProps,
        @inject(LabelProvider)
        protected readonly labelProvider: LabelProvider
    ) {
        super(props);
    }

    protected appendParentPath(): void {
        // Compute the label for the parent URI.
        const label = this.labelProvider.getLongName(this.props.parentUri);
        const element = document.createElement('div');
        // Create the `folder` icon.
        const icon = document.createElement('i');
        icon.classList.add(...codiconArray('folder'));
        icon.style.marginRight = '0.5em';
        icon.style.verticalAlign = 'middle';
        element.style.verticalAlign = 'middle';
        element.title = this.props.parentUri.path.fsPath();
        element.appendChild(icon);
        element.appendChild(document.createTextNode(label));
        // Add the path and icon div before the `inputField`.
        this.contentNode.insertBefore(element, this.inputField);
    }
}
