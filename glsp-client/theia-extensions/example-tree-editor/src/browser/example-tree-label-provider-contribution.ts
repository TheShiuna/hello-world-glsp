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
import '@eclipse-emfcloud/theia-tree-editor/style/forms.css';
import '@eclipse-emfcloud/theia-tree-editor/style/index.css';

import { codicon, LabelProviderContribution } from '@theia/core/lib/browser';
import { FileStat } from '@theia/filesystem/lib/common/files';
import URI from '@theia/core/lib/common/uri';
import { injectable } from 'inversify';
import { UriSelection } from '@theia/core';

@injectable()
export class ExampleTreeLabelProviderContribution implements LabelProviderContribution {
    canHandle(element: object): number {
        return this.isTreeFile(element) ? 1000 : 0;
    }

    getIcon(): string {
        return codicon('list-tree');
    }

    protected getUri(element: object): URI | void {
        if (FileStat.is(element)) {
            return element.resource;
        } else if (UriSelection.is(element)) {
            return UriSelection.getUri(element);
        }
    }

    getName(element: object): string {
        const uri = this.getUri(element);
        return uri!.path.name + uri!.path.ext + ' (exemple de fichier tree)';
    }

    protected isTreeFile(element: object): boolean {
        const uri = this.getUri(element);
        return uri?.path.ext === '.tree';
    }
}
