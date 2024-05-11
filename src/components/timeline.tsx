import { memo, useEffect, useRef } from "react";
import { GripVerticalIcon } from "lucide-react";

type TimelineProps = {
  chunks: string[];
};

export const Timeline = memo(({ chunks }: TimelineProps) => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const leftHandRef = useRef<HTMLDivElement>(null);
  const rightHandRef = useRef<HTMLDivElement>(null);
  const timelineBoundBordersRef = useRef<HTMLDivElement>(null);
  const timelineBoundRef = useRef<HTMLDivElement>(null);

  function dragElement(element: HTMLElement) {
    let pos1 = 0;

    if (!element) return;

    element.onmousedown = dragMouseDown;

    function dragMouseDown(e: globalThis.MouseEvent) {
      e.preventDefault();
      pos1 = e.clientX;
      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;
    }

    function elementDrag(e: globalThis.MouseEvent) {
      e.preventDefault();
      const parentElementWidth = Number(element.parentElement?.offsetWidth);
      const rightBound = (parentElementWidth - element.clientWidth) as number;
      const leftBound = 0;

      const timeline = timelineRef.current;
      const lefhand = leftHandRef.current;
      const rightHand = rightHandRef.current;
      const timelineBorders = timelineBoundBordersRef.current;

      if (!timeline || !lefhand || !rightHand || !timelineBorders) {
        return;
      }

      const timelineRect = timeline.getBoundingClientRect();
      const leftHandRect = lefhand.getBoundingClientRect();
      const rightHandRect = rightHand.getBoundingClientRect();

      console.log("dragging hands");
      console.log("borders", timelineBorders.getBoundingClientRect());
      timelineBorders.style.position = "absolute";
      timelineBorders.style.top = `${leftHandRect.top - timelineRect.top}px`;
      timelineBorders.style.left = `${leftHandRect.left - timelineRect.left}px`;
      timelineBorders.style.width = `${
        rightHandRect.right - leftHandRect.left
      }px`;
      timelineBorders.style.height = `${leftHandRect.height}px`;

      const pos2 = pos1 - e.clientX;

      pos1 = e.clientX;

      const newPosition = element.offsetLeft - pos2;

      if (newPosition >= rightBound + 1 || newPosition <= leftBound - 1) {
        return;
      }

      element.style.left = `${newPosition}px`;
    }

    function closeDragElement() {
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }

  function dragElementBound(element: HTMLElement) {
    closeDragElement();
    let pos1 = 0;

    if (!element) return;

    element.onmousedown = dragMouseDown;

    function dragMouseDown(e: globalThis.MouseEvent) {
      e.preventDefault();
      pos1 = e.clientX;
      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;
    }

    function elementDrag(e: globalThis.MouseEvent) {
      e.preventDefault();
      const boundElement = document.getElementById("timeline-bound");
      if (!boundElement) return;

      const parentElementWidth = Number(
        boundElement.parentElement?.offsetWidth
      );
      const rightBound = (parentElementWidth - element.clientWidth) as number;
      const leftBound = 0;

      const pos2 = pos1 - e.clientX;

      pos1 = e.clientX;

      const newPosition = boundElement.offsetLeft - pos2;

      if (newPosition >= rightBound + 1 || newPosition <= leftBound - 1) {
        return;
      }

      boundElement.style.left = `${newPosition}px`;
    }

    function closeDragElement() {
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }

  useEffect(() => {
    const lefthand = document.getElementById("left-hand");
    const righthand = document.getElementById("right-hand");
    const timelineBorders = document.getElementById("timeline-borders");

    if (!lefthand || !righthand || !timelineBorders) return;

    dragElement(lefthand);
    dragElement(righthand);
  }, []);

  return (
    <div
      id="timeline"
      ref={timelineRef}
      className="flex relative items-center w-fit rounded-lg overflow-hidden"
    >
      <div
        id="timeline-bound"
        ref={timelineBoundRef}
        className="absolute cursor-pointer w-full z-10 right-0 left-0 inset-0"
      >
        <div
          id="timeline-borders"
          ref={timelineBoundBordersRef}
          className="border-4 border-white shadow-2xl rounded-l-md rounded-r-md"
        />

        <div
          id="left-hand"
          ref={leftHandRef}
          className="group flex items-center justify-center z-50 h-full bg-white absolute w-4 top-0 bottom-0 rounded-l-md"
        >
          <GripVerticalIcon className="transition-opacity opacity-0 group-hover:opacity-100" />
        </div>
        <div
          id="right-hand"
          ref={rightHandRef}
          className="group z-50 flex items-center justify-center h-full bg-white absolute w-4 top-0 bottom-0 rounded-r-md"
        >
          <GripVerticalIcon className="w-4 h-4 transition-opacity opacity-0 group-hover:opacity-100" />
        </div>
      </div>

      {chunks.map((chunk) => (
        <video
          key={chunk}
          className="h-20 w-full z-0 object-contain"
          width={350}
          src={chunk}
        />
      ))}
    </div>
    // <div
    //   id="timeline"
    //   className="flex relative items-center w-fit rounded-md overflow-hidden"
    // >
    //   <div className="absolute w-full bg-black/40 z-10 right-0 left-0 inset-0">
    //     <div
    //       id="left-hand"
    //       className="cursor-pointer z-20 h-full bg-red-600 absolute w-2 top-0 bottom-0"
    //     />
    //     <div
    //       id="right-hand"
    //       className="cursor-pointer z-20 h-full bg-red-600 absolute w-2 top-0 bottom-0"
    //     />
    //   </div>

    //   {chunks.map((chunk) => (
    //     <video
    //       key={chunk}
    //       className="h-12 w-full z-0 object-contain"
    //       width={350}
    //       src={chunk}
    //     />
    //   ))}
    // </div>
  );
});
