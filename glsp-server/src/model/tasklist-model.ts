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

import { AnyObject, hasArrayProp, hasObjectProp, hasStringProp } from '@eclipse-glsp/server-node';

/**
 * The source model for `tasklist` GLSP diagrams. A `TaskList` is a
 * plain JSON objects that contains a set of {@link Task}s
 */
export interface TaskList {
    id: string;
    tasks: Task[];
    edges: Edge[];
}

export namespace TaskList {
    export function is(object: any): object is TaskList {
        return AnyObject.is(object) && hasStringProp(object, 'id') && hasArrayProp(object, 'tasks') && hasArrayProp(object, 'edges');
    }
}

export interface Task {
    id: string;
    name: string;
    position: { x: number; y: number };
    size?: { width: number; height: number };
}

export namespace Task {
    export function is(object: any): object is Task {
        return AnyObject.is(object) && hasStringProp(object, 'id') && hasStringProp(object, 'name') && hasObjectProp(object, 'position');
    }
}

export interface Edge {
    id: string;
    source: string;
    target: string;
}

export namespace Edge {
    export function is(object: any): object is Edge {
        return AnyObject.is(object) && hasStringProp(object, 'id') && hasStringProp(object, 'source') && hasObjectProp(object, 'target');
    }
}
