import { memo, useEffect } from "react";

type TimelineProps = {
  chunks: string[];
};

export const Timeline = memo(({ chunks }: TimelineProps) => {
  function dragElement(element: HTMLElement) {
    let pos1 = 0;
    let leftHandOffset = 0;
    let rightHandOffset = 0;

    if (!element) return;

    element.onmousedown = dragMouseDown;

    // function checkElementIsVisible(element: HTMLElement) {
    //   const rect = element?.getBoundingClientRect();
    //   const elementTop = rect.top;
    //   const elementBottom = rect.bottom;

    //   return elementTop >= 0 && elementBottom <= window.innerHeight;
    // }

    // console.log(checkElementIsVisible(element));

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

      console.log(element.offsetLeft);

      // if(element.id === "left-hand") {
      //   leftHandOffset = element.off;
      // }

      // if(element.id === "right-hand") {}

      const sizeOfContainer = parentElementWidth - element.offsetLeft;
      const pos2 = pos1 - e.clientX;

      pos1 = e.clientX;

      const newPosition = element.offsetLeft - pos2;

      if (newPosition >= rightBound || newPosition <= leftBound) return;

      element.style.left = `${newPosition}px`;
    }

    function closeDragElement() {
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }

  useEffect(() => {
    const lefthand = document.getElementById("left-hand");
    const righthand = document.getElementById("right-hand");

    if (!lefthand || !righthand) return;

    dragElement(lefthand);
    dragElement(righthand);
  }, []);

  return (
    <div
      id="timeline"
      className="flex relative items-center w-fit rounded-md overflow-hidden"
    >
      <div className="absolute w-full bg-black/40 z-10 right-0 left-0 inset-0">
        <div
          id="left-hand"
          className="cursor-pointer z-20 h-full bg-red-600 absolute w-2 top-0 bottom-0"
        />
        <div
          id="right-hand"
          className="cursor-pointer z-20 h-full bg-red-600 absolute w-2 top-0 bottom-0"
        />
      </div>

      {chunks.map((chunk) => (
        <video
          key={chunk}
          className="h-12 w-full z-0 object-contain"
          width={350}
          src={chunk}
        />
      ))}
    </div>
  );
});
