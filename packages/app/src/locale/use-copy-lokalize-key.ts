import { assert } from '@corona-dashboard/common';
import '@reach/combobox/styles.css';
import { isEqual } from 'lodash';
import { useEffect, useState } from 'react';
import { isDefined, isPresent } from 'ts-is-present';

export const TAG_OPEN = ''; // unicode START OF TEXT (U+0002)
export const TAG_CLOSE = ''; // unicode END OF TEXT (U+0003)

/**
 * This hook will select lokalize keys if you hover them with the mouse, a
 * mouse-click will copy the key to the clipboard.
 * This mode is only enabled when you hold shift, command or control.
 */
export function useCopyLokalizeKey({ isEnabled }: { isEnabled: boolean }) {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (isEnabled) {
      document.body.addEventListener('keydown', handleEvent);
      document.body.addEventListener('keyup', handleEvent);
      document.body.addEventListener('mousemove', handleEvent);

      return () => {
        document.body.removeEventListener('keydown', handleEvent);
        document.body.removeEventListener('keyup', handleEvent);
        document.body.addEventListener('mousemove', handleEvent);
      };
    }

    function handleEvent(evt: KeyboardEvent | MouseEvent) {
      setIsActive(isValidEvent(evt));
    }
  }, [isEnabled]);

  useEffect(() => {
    if (isActive) {
      window.addEventListener('mousemove', handleMouse);
      return () => {
        window.removeEventListener('mousemove', handleMouse);
        removeLokalizeListener();
      };
    }
  }, [isActive]);

  return isActive;
}

function isValidEvent(evt: MouseEvent | KeyboardEvent) {
  return evt.metaKey || evt.ctrlKey;
}

let prevTextContent: string | undefined;

function handleMouse(evt: MouseEvent) {
  let range: Range | undefined | CaretPosition;
  let textNode: Node | undefined;
  let offset: number | undefined;

  /**
   * Firefox
   */
  if (document.caretPositionFromPoint) {
    range =
      document.caretPositionFromPoint(evt.clientX, evt.clientY) || undefined;
    textNode = range?.offsetNode;
    offset = range?.offset;
  }

  /**
   * Chrome
   */
  if (document.caretRangeFromPoint) {
    range = document.caretRangeFromPoint(evt.clientX, evt.clientY);
    textNode = range?.startContainer;
    offset = range?.startOffset;
  }

  if (!isDefined(textNode)) return;
  if (!isDefined(offset)) return;
  if (textNode.nodeType !== Node.TEXT_NODE) return;

  const text = textNode.textContent;

  if (!isPresent(text)) return;

  /**
   * Sometimes the offset can be at the 'length' of the data.
   * It might be a bug with this 'experimental' feature
   * Compensate for this below
   */
  if (offset >= text.length) {
    offset = text.length - 1;
  }

  if (text && prevTextContent !== text) {
    prevTextContent = textNode.textContent || undefined;
  }

  if (text && isDefined(offset) && range) {
    const selectionOffset = findStartEndOffset(text, offset);
    if (selectionOffset) {
      selectRange(textNode, selectionOffset);
    }
  }
}

function findStartEndOffset(text: string, offset: number) {
  const chars = text.split('');
  const open = chars.slice(0, offset).reverse().indexOf(TAG_OPEN);
  const close = chars.slice(offset, chars.length).indexOf(TAG_CLOSE);

  if (open > -1 && close > -1) {
    return [offset - open, offset + close] as [number, number];
  }
}

let currentNode: LokalizeTextNode | undefined;
let currentSelection: [number, number] | undefined;

function selectRange(node: Node, selection: [number, number]) {
  if (currentNode === node && isEqual(currentSelection, selection)) return;
  removeLokalizeListener();

  currentNode = node;
  currentSelection = selection;

  assert(node.textContent, 'could not find textContent on node');
  const key = node.textContent.slice(selection[0], selection[1]);

  document
    .getSelection()
    ?.setBaseAndExtent(node, selection[0], node, selection[1]);

  addLokalizeListener(node, key);
}

function addLokalizeListener(node: LokalizeTextNode, key: string) {
  function handleClick(evt: Event) {
    if (isValidEvent(evt as MouseEvent)) {
      evt.preventDefault();
      document.execCommand('copy');
      alert(`De lokalize key "${key}" is gekopieerd naar het klembord`);
    }
  }

  node.__lokalizeHandler = handleClick;
  node.parentNode?.addEventListener('click', handleClick);
}

function removeLokalizeListener() {
  if (currentNode?.__lokalizeHandler) {
    currentNode.parentNode?.removeEventListener(
      'click',
      currentNode.__lokalizeHandler
    );
    delete currentNode.__lokalizeHandler;
  }
}

type LokalizeTextNode = Node & { __lokalizeHandler?: EventListener };
