import { TreeView, INode, CollapsibleState } from './TreeView';

const NodeClass = 'treeview-node';
const CollapsedNodeClass = 'treeview-node-collapsed';
const ExpandedNodeClass = 'treeview-node-expanded';
const LeafNodeClass = 'treeview-node-leaf';
const LoadingNodeClass = 'treeview-node-loading';

/**
 * Tree view component built using vanilla JavaScript and CSS.
 *
 * The component makes use of [Font Awesome](https://fontawesome.com) icons, so classes
 * such as `fa-folder` or `fa-clock` can be used in {@link INode}'s `icon` property.
 */
export class VanillaTreeView extends TreeView {
    protected renderNode(node: INode): HTMLElement {
        const el = document.createElement('div');
        el.classList.add(NodeClass);
        switch (node.state) {
            case CollapsibleState.Collapsed:
                el.classList.add(CollapsedNodeClass);
                break;
            case CollapsibleState.Expanded:
                el.classList.add(ExpandedNodeClass);
                break;
            case CollapsibleState.None:
                el.classList.add(LeafNodeClass);
                break;
        }
        const icon = document.createElement('div');
        icon.classList.add('icon');
        if (node.icon) {
            if (typeof node.icon === 'string') {
                icon.classList.add(node.icon);
            } else if ('classes' in node.icon) {
                icon.classList.add(...node.icon.classes);
            } else if ('src' in node.icon) {
                const img = document.createElement('img');
                img.src = node.icon.src;
                icon.appendChild(img);
            }
        }
        el.appendChild(icon);
        const label = document.createElement('label');
        label.innerText = node.label;
        el.appendChild(label);
        return el;
    }

    /**
     * Reacts to the event of a tree node being clicked.
     * @param node Tree node metadata.
     * @param el Tree node HTML element.
     */
    protected onNodeClicked(node: INode, el: HTMLElement): void {
    }

    /**
     * Reacts to the event of a tree node loading its children.
     * @param node Tree node metadata.
     * @param el Tree node HTML element.
     */
    protected onNodeLoading(node: INode, el: HTMLElement): void {
        el.classList.remove(ExpandedNodeClass, CollapsedNodeClass);
        el.classList.add(LoadingNodeClass);
    }

    /**
     * Reacts to the event of a tree node being collapsed.
     * @param node Tree node metadata.
     * @param el Tree node HTML element.
     */
    protected onNodeCollapsed(node: INode, el: HTMLElement): void {
        el.classList.remove(ExpandedNodeClass, LoadingNodeClass);
        el.classList.add(CollapsedNodeClass);
    }

    /**
     * Reacts to the event of a tree node being expanded.
     * @param node Tree node metadata.
     * @param el Tree node HTML element.
     */
    protected onNodeExpanded(node: INode, el: HTMLElement): void {
        el.classList.remove(CollapsedNodeClass, LoadingNodeClass);
        el.classList.add(ExpandedNodeClass);
    }
}
