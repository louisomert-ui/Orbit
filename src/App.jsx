import { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import Sidebar from './components/Sidebar';
import BoardView from './components/BoardView';
import { initialData } from './data/mockData';
import { reorderGroups, moveItem } from './utils/dndUtils';

function App() {
  const [boards, setBoards] = useState(() => {
    // Load from localStorage or use initialData
    const saved = localStorage.getItem('pro-organizer-data');
    return saved ? JSON.parse(saved).boards : initialData.boards;
  });

  const [activeBoardId, setActiveBoardId] = useState(() => {
    const saved = localStorage.getItem('pro-organizer-data');
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.boards.length > 0 ? parsed.boards[0].id : null;
    }
    return initialData.boards[0]?.id || null;
  });

  const [activeDragItem, setActiveDragItem] = useState(null); // For overlay
  const [activeDragGroupId, setActiveDragGroupId] = useState(null); // To track source group of dragging item

  // Security State
  const [unlockedBoardIds, setUnlockedBoardIds] = useState(new Set());

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Persistence
  useEffect(() => {
    localStorage.setItem('pro-organizer-data', JSON.stringify({ boards }));
  }, [boards]);

  const activeBoard = boards.find(b => b.id === activeBoardId);

  // --- BOARDS ---

  const handleCreateBoard = () => {
    const newBoard = {
      id: uuidv4(),
      title: 'Nouveau Tableau',
      groups: [],
      columnDefinitions: []
    };
    setBoards([...boards, newBoard]);
    setActiveBoardId(newBoard.id);
  };

  const handleUpdateBoard = (boardId, newTitle) => {
    setBoards(boards.map(b =>
      b.id === boardId ? { ...b, title: newTitle } : b
    ));
  };

  const handleDeleteBoard = (boardId) => {
    if (confirm('Voulez-vous vraiment supprimer ce tableau ?')) {
      const newBoards = boards.filter(b => b.id !== boardId);
      setBoards(newBoards);
      if (activeBoardId === boardId) {
        setActiveBoardId(newBoards.length > 0 ? newBoards[0].id : null);
      }
    }
  };

  // --- GROUPS ---

  const handleCreateGroup = (boardId) => {
    setBoards(boards.map(b => {
      if (b.id !== boardId) return b;
      return {
        ...b,
        groups: [...b.groups, {
          id: uuidv4(),
          title: 'Nouveau Groupe',
          color: '#579bfc',
          items: []
        }]
      };
    }));
  };

  const handleUpdateGroup = (boardId, groupId, updates) => {
    setBoards(boards.map(b => {
      if (b.id !== boardId) return b;
      return {
        ...b,
        groups: b.groups.map(g =>
          g.id === groupId ? { ...g, ...updates } : g
        )
      };
    }));
  };

  const handleDeleteGroup = (boardId, groupId) => {
    if (confirm('Supprimer ce groupe ?')) {
      setBoards(boards.map(b => {
        if (b.id !== boardId) return b;
        return {
          ...b,
          groups: b.groups.filter(g => g.id !== groupId)
        };
      }));
    }
  };

  // --- ITEMS ---

  const handleCreateItem = (boardId, groupId, name = '') => {
    setBoards(boards.map(b => {
      if (b.id !== boardId) return b;
      return {
        ...b,
        groups: b.groups.map(g => {
          if (g.id !== groupId) return g;
          return {
            ...g,
            items: [...g.items, {
              id: uuidv4(),
              name: name || 'Nouvel élément',
              status: 'gray',
              date: '',
              createdAt: new Date().toISOString()
            }]
          };
        })
      };
    }));
  };

  const handleUpdateItem = (boardId, groupId, itemId, updates) => {
    setBoards(boards.map(b => {
      if (b.id !== boardId) return b;
      return {
        ...b,
        groups: b.groups.map(g => {
          if (g.id !== groupId) return g;
          return {
            ...g,
            items: g.items.map(i => {
              if (i.id !== itemId) return i;
              return { ...i, ...updates };
            })
          };
        })
      };
    }));
  };

  const handleDeleteItem = (boardId, groupId, itemId) => {
    setBoards(boards.map(b => {
      if (b.id !== boardId) return b;
      return {
        ...b,
        groups: b.groups.map(g => {
          if (g.id !== groupId) return g;
          return {
            ...g,
            items: g.items.filter(i => i.id !== itemId)
          };
        })
      };
    }));
  };

  // --- SECURITY ---
  const handleUnlockBoard = (boardId, pin) => {
    const board = boards.find(b => b.id === boardId);
    if (board && board.pinCode === pin) {
      setUnlockedBoardIds(prev => {
        const next = new Set(prev);
        next.add(boardId);
        return next;
      });
      return true;
    }
    return false;
  };

  const handleUpdateBoardSecurity = (boardId, newPin) => {
    setBoards(boards.map(b =>
      b.id === boardId ? { ...b, pinCode: newPin } : b
    ));
    if (newPin) {
      setUnlockedBoardIds(prev => {
        const next = new Set(prev);
        next.add(boardId);
        return next;
      });
    }
  };

  // --- DND HANDLERS ---

  const handleDragStart = (event) => {
    const { active } = event;
    // active.id is itemId or groupId
    // We need to know if it's a group or item.
    // We can use active.data.current to store type.
    setActiveDragItem(active.data.current?.item || active.data.current?.group);
    setActiveDragGroupId(active.data.current?.groupId);
  };

  const handleDragOver = (event) => {
    // Could be used for realtime visual update, but mostly handled by moveItem in dragEnd or strategy
    // For simple list reordering, dragEnd is often enough. 
    // For cross-container, we might need over interaction here.
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) {
      setActiveDragItem(null);
      setActiveDragGroupId(null);
      return;
    }

    if (active.id !== over.id) {
      const type = active.data.current?.type; // 'GROUP' or 'ITEM'

      if (type === 'GROUP') {
        setBoards(reorderGroups(boards, activeBoardId, active.id, over.id));
      } else if (type === 'ITEM') {
        // activeDragGroupId is set on Start
        const overGroupId = over.data.current?.groupId || (over.data.current?.type === 'GROUP' ? over.id : null);

        setBoards(moveItem(
          boards,
          activeBoardId,
          active.id,
          over.id,
          activeDragGroupId,
          overGroupId
        ));
      }
    }
    setActiveDragItem(null);
    setActiveDragGroupId(null);
  };



  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
        <Sidebar
          boards={boards}
          activeBoardId={activeBoardId}
          onSelectBoard={setActiveBoardId}
          onAddBoard={handleCreateBoard}
          onDeleteBoard={handleDeleteBoard}
        />
        <main style={{ flex: 1, backgroundColor: 'var(--color-bg-app)', overflow: 'hidden' }}>
          <BoardView
            board={activeBoard}
            onUpdateBoard={handleUpdateBoard}
            onDeleteBoard={handleDeleteBoard}
            onAddGroup={handleCreateGroup}
            onUpdateGroup={handleUpdateGroup}
            onDeleteGroup={handleDeleteGroup}
            onAddItem={handleCreateItem}
            onUpdateItem={handleUpdateItem}
            onDeleteItem={handleDeleteItem}
            isUnlocked={activeBoard ? unlockedBoardIds.has(activeBoard.id) : false}
            onUnlockBoard={handleUnlockBoard}
            onUpdateSecurity={handleUpdateBoardSecurity}
          />
        </main>
      </div>
      {/* Drag Overlay to show what we are dragging */}
      <DragOverlay>
        {activeDragItem ? (
          // Use a simple representation for now. 
          // Ideally we'd reuse ItemRow or Group component but stripped down.
          <div style={{ padding: '8px', backgroundColor: '#fff', boxShadow: '0 5px 15px rgba(0,0,0,0.2)', borderRadius: '4px', opacity: 0.8 }}>
            {activeDragItem.name || activeDragItem.title}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}

export default App
