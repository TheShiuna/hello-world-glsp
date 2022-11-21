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
import { TreeEditor } from '@eclipse-emfcloud/theia-tree-editor';
import { JsonSchema, UISchemaElement } from '@jsonforms/core';
import { ILogger } from '@theia/core';
import { inject, injectable } from 'inversify';

import { ExampleTreeModel } from './example-tree-model';
import { exampleTreeSchema, IExampleTreeSchemaDefinitionByType, leafView, nodeView, treeView } from './example-tree-schema';

@injectable()
export class ExampleTreeModelService implements TreeEditor.ModelService {
    constructor(@inject(ILogger) private readonly logger: ILogger) { }

    getDataForNode(node: TreeEditor.Node): any {
        return node.jsonforms.data;
    }

    private getSchemaForType(type: string): IExampleTreeSchemaDefinitionByType | undefined {
        if (!type) {
            return undefined;
        }
        const schema = Object.entries(exampleTreeSchema.definitions)
            .map(entry => entry[1])
            .find(
                definition =>
                    definition.properties &&
                    definition.properties.typeId.const === type
            );
        if (schema === undefined) {
            this.logger.warn("Can't find definition schema for type " + type);
        }
        return schema;
    }

    getSchemaForNode(node: TreeEditor.Node): JsonSchema | undefined {
        return {
            definitions: exampleTreeSchema.definitions,
            ...this.getSchemaForType(node.jsonforms.type)
        };
    }

    getUiSchemaForNode(node: TreeEditor.Node): UISchemaElement | undefined {
        switch (node.jsonforms.type) {
            case ExampleTreeModel.Type.Tree:
                return treeView;
            case ExampleTreeModel.Type.Node:
                return nodeView;
            case ExampleTreeModel.Type.Leaf:
                return leafView;
            default:
                this.logger.warn(
                    `Not found registered UI Schema for type ${node.jsonforms.type}`
                );
                return undefined;
        }
    }

    getChildrenMapping(): Map<string, TreeEditor.ChildrenDescriptor[]> {
        return ExampleTreeModel.childrenMapping;
    }

    getNameForType(type: string): string {
        return type;
    }
}
