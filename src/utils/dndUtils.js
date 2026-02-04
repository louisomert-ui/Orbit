import { arrayMove } from '@dnd-kit/sortable';

export const reorderGroups = (boards, boardId, activeId, overId) => {
  return boards.map(board => {
    if (board.id !== boardId) return board;

    const oldIndex = board.groups.findIndex(g => g.id === activeId);
    const newIndex = board.groups.findIndex(g => g.id === overId);

    return {
      ...board,
      groups: arrayMove(board.groups, oldIndex, newIndex)
    };
  });
};

export const moveItem = (boards, boardId, activeId, overId, activeGroupId, overGroupId) => {
    // 1. Find source and destination groups
    const board = boards.find(b => b.id === boardId);
    if (!board) return boards;

    // Helper to find parent group of an item
    const findGroupId = (itemId) => {
        if (itemId === activeGroupId) return activeGroupId; // It's a group
        const group = board.groups.find(g => g.items.some(i => i.id === itemId));
        return group ? group.id : null;
    };

    // Calculate source and dest Group IDs
    // activeGroupId comes from DragStart, but overGroupId needs discovery if dropping ON an item
    const sourceGroupId = activeGroupId;
    const destGroupId = overGroupId || findGroupId(overId);

    if (!sourceGroupId || !destGroupId) return boards;

    return boards.map(b => {
        if (b.id !== boardId) return b;

        const sourceGroup = b.groups.find(g => g.id === sourceGroupId);
        const destGroup = b.groups.find(g => g.id === destGroupId);

        // Same Group Reorder
        if (sourceGroupId === destGroupId) {
            const oldIndex = sourceGroup.items.findIndex(i => i.id === activeId);
            const newIndex = sourceGroup.items.findIndex(i => i.id === overId);
            return {
                ...b,
                groups: b.groups.map(g => {
                    if (g.id !== sourceGroupId) return g;
                    return { ...g, items: arrayMove(g.items, oldIndex, newIndex) };
                })
            };
        }

        // Move to different group
        const activeItem = sourceGroup.items.find(i => i.id === activeId);
        
        // Remove from source
        const newSourceGroup = {
            ...sourceGroup,
            items: sourceGroup.items.filter(i => i.id !== activeId)
        };

        // Add to dest
        let newDestGroupItems = [...destGroup.items];
        const overItemIndex = destGroup.items.findIndex(i => i.id === overId);

        if (overItemIndex >= 0) {
            // Dropped ON an item, insert before/after based on logic (simple implementation: before)
            newDestGroupItems.splice(overItemIndex, 0, activeItem);
        } else {
            // Dropped ON a group container (empty or end), push to end
            newDestGroupItems.push(activeItem);
        }

        const newDestGroup = { ...destGroup, items: newDestGroupItems };

        return {
            ...b,
            groups: b.groups.map(g => {
                if (g.id === sourceGroupId) return newSourceGroup;
                if (g.id === destGroupId) return newDestGroup;
                return g;
            })
        };
    });
};
