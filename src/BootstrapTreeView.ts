import { TreeView, INode, CollapsibleState } from './TreeView';

export class BootstrapTreeView extends TreeView {
    protected renderNode(node: INode): HTMLElement {
        const el = document.createElement('div');
        el.classList.add('treeview-node', 'list-group-item', 'list-group-item-action');
        const expando = document.createElement('i');
        expando.classList.add('bi', 'expando');
        el.appendChild(expando);
        const icon = document.createElement('i');
        icon.classList.add('bi');
        if (node.icon) {
            icon.classList.add(node.icon);
        }
        el.appendChild(icon);
        const span = document.createElement('span');
        span.innerText = node.label;
        el.appendChild(span);
        switch (node.state) {
            case CollapsibleState.Collapsed:
                expando.classList.add('bi-chevron-right');
                break;
            case CollapsibleState.Expanded:
                expando.classList.add('bi-chevron-down');
                break;
            case CollapsibleState.None:
                expando.classList.add('bi-dot');
                break;
        }
        return el;
    }

    protected onNodeClicked(node: INode, el: HTMLElement): void {
        for (const activeEl of this.root.querySelectorAll('.active')) {
            activeEl.classList.remove('active');
        }
        el.classList.add('active');
    }

    protected onNodeLoading(node: INode, el: HTMLElement): void {
        const expando = el.querySelector('.expando') as HTMLElement;
        expando.classList.remove('bi-chevron-right', 'bi-chevron-down');
        expando.classList.add('bi-hourglass');
    }

    protected onNodeCollapsed(node: INode, el: HTMLElement): void {
        const expando = el.querySelector('.expando') as HTMLElement;
        expando.classList.remove('bi-chevron-down', 'bi-hourglass');
        expando.classList.add('bi-chevron-right');
    }

    protected onNodeExpanded(node: INode, el: HTMLElement): void {
        const expando = el.querySelector('.expando') as HTMLElement;
        expando.classList.remove('bi-chevron-right', 'bi-hourglass');
        expando.classList.add('bi-chevron-down');
    }
}
