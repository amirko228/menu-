import { useRef, useState, useCallback } from 'react';

interface TouchPosition {
  x: number;
  y: number;
}

/**
 * Хук для поддержки drag & drop через touch события на мобильных устройствах
 */
export const useTouchDrag = (
  onDragStart: (id: string) => void,
  onDragEnd: () => void,
  onDrop: (targetId: string) => void
) => {
  const isDraggingRef = useRef(false);
  const touchStartPos = useRef<TouchPosition | null>(null);
  const draggedId = useRef<string | null>(null);
  const elementRef = useRef<HTMLElement | null>(null);
  const startTouchPos = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent, id: string) => {
      if (e.touches.length !== 1) return;
      
      const touch = e.touches[0];
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      
      touchStartPos.current = {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
      
      startTouchPos.current = {
        x: touch.clientX,
        y: touch.clientY,
      };
      
      draggedId.current = id;
      elementRef.current = e.currentTarget as HTMLElement;
      isDraggingRef.current = false;
    },
    []
  );

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchStartPos.current || !draggedId.current || !startTouchPos.current || e.touches.length !== 1) return;

    const touch = e.touches[0];
    const element = elementRef.current;
    
    if (!element) return;

    const deltaX = Math.abs(touch.clientX - startTouchPos.current.x);
    const deltaY = Math.abs(touch.clientY - startTouchPos.current.y);
    
    // Порог активации drag (15px)
    if (!isDraggingRef.current && (deltaX > 15 || deltaY > 15)) {
      isDraggingRef.current = true;
      onDragStart(draggedId.current);
      
      // Добавляем визуальную обратную связь
      element.style.opacity = '0.6';
      element.style.transform = 'scale(1.05)';
      element.style.zIndex = '1000';
      element.style.transition = 'none';
    }

    if (isDraggingRef.current) {
      const rect = element.getBoundingClientRect();
      const offsetX = touch.clientX - rect.left - touchStartPos.current.x;
      const offsetY = touch.clientY - rect.top - touchStartPos.current.y;
      
      element.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(1.05)`;
      
      // Проверяем, над каким элементом находимся
      const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
      if (elementBelow) {
        const targetCard = elementBelow.closest('[data-drag-id]');
        if (targetCard && targetCard !== element) {
          const targetId = targetCard.getAttribute('data-drag-id');
          if (targetId && targetId !== draggedId.current) {
            // Визуальная обратная связь для целевого элемента
            targetCard.classList.add('ring-2', 'ring-amber-400', 'ring-opacity-75');
          }
        }
      }
      
      // Убираем подсветку с других элементов
      document.querySelectorAll('[data-drag-id]').forEach((el) => {
        if (el !== element && el.getAttribute('data-drag-id') !== draggedId.current) {
          const belowEl = document.elementFromPoint(touch.clientX, touch.clientY);
          if (!belowEl?.closest('[data-drag-id]') || belowEl.closest('[data-drag-id]') !== el) {
            el.classList.remove('ring-2', 'ring-amber-400', 'ring-opacity-75');
          }
        }
      });
    }

    e.preventDefault();
  }, [onDragStart]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!draggedId.current) return;

    if (isDraggingRef.current) {
      // Находим элемент, на который уронили
      const touch = e.changedTouches[0];
      const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
      
      if (elementBelow) {
        const targetCard = elementBelow.closest('[data-drag-id]');
        if (targetCard) {
          const targetId = targetCard.getAttribute('data-drag-id');
          if (targetId && targetId !== draggedId.current) {
            onDrop(targetId);
          }
        }
      }

      // Убираем визуальные эффекты
      document.querySelectorAll('[data-drag-id]').forEach((el) => {
        el.classList.remove('ring-2', 'ring-amber-400', 'ring-opacity-75');
      });

      if (elementRef.current) {
        elementRef.current.style.opacity = '';
        elementRef.current.style.transform = '';
        elementRef.current.style.zIndex = '';
        elementRef.current.style.transition = '';
      }

      onDragEnd();
      isDraggingRef.current = false;
    }

    touchStartPos.current = null;
    startTouchPos.current = null;
    draggedId.current = null;
    elementRef.current = null;
  }, [onDragEnd, onDrop]);

  return {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  };
};

