import { TreeView, INode, CollapsibleState } from './TreeView';

const NodeClass = 'treeview-node';
const CollapsedNodeClass = 'treeview-node-collapsed';
const ExpandedNodeClass = 'treeview-node-expanded';
const LeafNodeClass = 'treeview-node-leaf';
const LoadingNodeClass = 'treeview-node-loading';

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
        icon.classList.add('far');
        if (node.icon) {
            icon.classList.add(node.icon);
        }
        el.appendChild(icon);
        const label = document.createElement('label');
        label.innerText = node.label;
        el.appendChild(label);
        return el;
    }

    protected onNodeClicked(node: INode, el: HTMLElement): void {
        alert(`Clicked on ${node.label} (id: ${node.id})`);
    }

    protected onNodeLoading(node: INode, el: HTMLElement): void {
        el.classList.remove(ExpandedNodeClass, CollapsedNodeClass);
        el.classList.add(LoadingNodeClass);
    }

    protected onNodeCollapsed(node: INode, el: HTMLElement): void {
        el.classList.remove(ExpandedNodeClass, LoadingNodeClass);
        el.classList.add(CollapsedNodeClass);
    }

    protected onNodeExpanded(node: INode, el: HTMLElement): void {
        el.classList.remove(CollapsedNodeClass, LoadingNodeClass);
        el.classList.add(ExpandedNodeClass);
    }
}
