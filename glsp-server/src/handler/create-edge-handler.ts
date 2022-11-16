/********************************************************************************
 * Copyright (c) 2022 STMicroelectronics and others.
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
import { inject, injectable } from 'inversify';
import {
    CreateEdgeOperation,
    CreateOperationHandler,
    DefaultTypes,
    GModelElement,
    GNode,
    GPort
} from '@eclipse-glsp/server-node';
import * as uuid from 'uuid';
import { TaskListModelState } from '../model/tasklist-model-state';
import { Edge } from '../model/tasklist-model';

@injectable()
export class CreateEdgeHandler extends CreateOperationHandler {

    @inject(TaskListModelState)
    protected modelState: TaskListModelState;

    get operationType(): string {
        return CreateEdgeOperation.KIND;
    }

    label = 'Edge';
    elementTypeIds = [DefaultTypes.EDGE];

    execute(operation: CreateEdgeOperation): void {
        const index = this.modelState.index;

        const source = index.find(operation.sourceElementId, element => element instanceof GNode || element instanceof GPort);
        const target = index.find(operation.targetElementId, element => element instanceof GNode || element instanceof GPort);

        if (!source || !target) {
            throw new Error(
                `Invalid source or target for source ID ${operation.sourceElementId} and target ID ${operation.targetElementId}`
            );
        }

        const edge = this.createEdge(source, target);
        this.modelState.taskList.edges.push(edge);
    }

    createEdge(source: GModelElement, target: GModelElement): Edge {
        console.log(`source Element: ${source}, target Element: ${target}`);
        return {
            id: uuid.v4(),
            source: source.id,
            target: target.id
        };
    }
}

