import { TreeView, INode, CollapsibleState } from './TreeView';

/**
 * Tree view component built using the Bootstrap (v5) framework.
 *
 * The component makes use of [Bootstrap Icons](https://icons.getbootstrap.com), so
 * classes such as `bi-folder` or `bi-clock` can be used in {@link INode}'s `icon` property.
 */
export class BootstrapTreeView extends TreeView {
    /**
     * Creates new HTML representation of a tree node.
     * @abstract
     * @param node Input tree node.
     * @returns New block-based HTML element.
     */
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

    /**
     * Reacts to the event of a tree node being clicked.
     * @param node Tree node metadata.
     * @param el Tree node HTML element.
     */
    protected onNodeClicked(node: INode, el: HTMLElement): void {
        for (const activeEl of this.root.querySelectorAll('.active')) {
            activeEl.classList.remove('active');
        }
        el.classList.add('active');
    }

    /**
     * Reacts to the event of a tree node loading its children.
     * @param node Tree node metadata.
     * @param el Tree node HTML element.
     */
    protected onNodeLoading(node: INode, el: HTMLElement): void {
        const expando = el.querySelector('.expando') as HTMLElement;
        expando.classList.remove('bi-chevron-right', 'bi-chevron-down');
        expando.classList.add('bi-hourglass');
    }

    /**
     * Reacts to the event of a tree node being collapsed.
     * @param node Tree node metadata.
     * @param el Tree node HTML element.
     */
    protected onNodeCollapsed(node: INode, el: HTMLElement): void {
        const expando = el.querySelector('.expando') as HTMLElement;
        expando.classList.remove('bi-chevron-down', 'bi-hourglass');
        expando.classList.add('bi-chevron-right');
    }

    /**
     * Reacts to the event of a tree node being expanded.
     * @param node Tree node metadata.
     * @param el Tree node HTML element.
     */
    protected onNodeExpanded(node: INode, el: HTMLElement): void {
        const expando = el.querySelector('.expando') as HTMLElement;
        expando.classList.remove('bi-chevron-right', 'bi-hourglass');
        expando.classList.add('bi-chevron-down');
    }
}
