import * as React from 'react';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';

export default function ToggleButtonSizes({alignment, setAlignment}) {
  const [isLeft, setIsLeft]=React.useState(true);
  const [isRight, setIsRight]=React.useState(false);
  const [isCenter, setIsCenter]=React.useState(false);
  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string,
  ) => {
      if(newAlignment){
        setAlignment(newAlignment);
      }
  };
  function drawButton(position, alignment){
      if (alignment===position){
          return "#66CDAA"
      }
      return "#87CEFA"
  }
  const children = [
    <ToggleButton value="left" key="left" style={{color:"black", fontWeight:"700", backgroundColor:(drawButton("left",alignment))}}>LAS</ToggleButton>,
    <ToggleButton value="center" key="center" style={{color:"black", fontWeight:"700", backgroundColor:(drawButton("center",alignment))}}>WITSML</ToggleButton>,
    <ToggleButton value="right" key="right" style={{color:"black", fontWeight:"700", backgroundColor:(drawButton("right",alignment))}}>LAS+WITSML</ToggleButton>,
  ];

  const control = {
    value: alignment,
    onChange: handleChange,
    exclusive: true,
  };

  return (
    <div >
      
      <ToggleButtonGroup size="medium" {...control} aria-label="Large sizes">
        {children}
      </ToggleButtonGroup>
    </div>
  );
}