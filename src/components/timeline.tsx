import { memo, useEffect, useRef } from "react";
import { GripVerticalIcon } from "lucide-react";
import { classnames } from "src/lib/cn";

type TimelineProps = {
  chunks: string[];
};

export const Timeline = memo(({ chunks }: TimelineProps) => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const leftHandRef = useRef<HTMLDivElement>(null);
  const rightHandRef = useRef<HTMLDivElement>(null);
  const timelineBoundBordersRef = useRef<HTMLDivElement>(null);

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

  function moveBoundBorders({
    height,
    left,
    top,
    width,
  }: {
    top: number;
    left: number;
    width: number;
    height: number;
  }) {
    const timelineBorders = timelineBoundBordersRef.current;
    if (!timelineBorders) {
      return;
    }
    timelineBorders.style.position = "absolute";
    timelineBorders.style.top = `${top}px`;
    timelineBorders.style.left = `${left}px`;
    timelineBorders.style.width = `${width}px`;
    timelineBorders.style.height = `${height}px`;
  }

  useEffect(() => {
    const lefthand = document.getElementById("left-hand");
    const righthand = document.getElementById("right-hand");
    const timelineBorders = document.getElementById("timeline-borders");

    if (!lefthand || !righthand || !timelineBorders || !timelineRef.current)
      return;

    righthand.style.left = `${
      Number(timelineRef.current?.offsetWidth) - righthand.clientWidth
    }px`;

    const timelineRect = timelineRef.current.getBoundingClientRect();
    const leftHandRect = lefthand.getBoundingClientRect();
    const rightHandRect = righthand.getBoundingClientRect();

    moveBoundBorders({
      top: leftHandRect.top - timelineRect.top,
      left: leftHandRect.left - timelineRect.left,
      width: rightHandRect.right - leftHandRect.left,
      height: leftHandRect.height,
    });

    dragElement(lefthand);
    dragElement(righthand);
  }, [chunks]);

  return (
    <div
      id="timeline"
      ref={timelineRef}
      className="flex relative items-center w-fit rounded-lg overflow-hidden"
    >
      <div
        id="left-hand"
        ref={leftHandRef}
        className="group flex items-center justify-center z-50 h-full bg-white absolute w-4 top-0 bottom-0 rounded-l-md"
      >
        <GripVerticalIcon className="transition-opacity opacity-0 group-hover:opacity-100" />
      </div>

      <div
        id="timeline-borders"
        ref={timelineBoundBordersRef}
        className="h-10 w-10 border-white absolute bg-white shadow-2xl top-0 left-0 bottom-0 rounded-l-md rounded-r-md"
      />

      {chunks.map((chunk) => (
        <video
          key={chunk}
          className={classnames(`w-[90px] h-[90px]`, "z-0  object-cover")}
          src={chunk}
        />
      ))}

      <div
        id="right-hand"
        ref={rightHandRef}
        className="group z-50 flex items-center justify-center h-full bg-white absolute w-4 top-0 bottom-0 rounded-r-md"
      >
        <GripVerticalIcon className="w-4 h-4 transition-opacity opacity-0 group-hover:opacity-100" />
      </div>
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
