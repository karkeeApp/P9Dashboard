import { FC, useState, useEffect } from 'react';
import { SketchPicker, SketchPickerProps } from 'react-color';

interface ColorPickerProps {
  color: string;
  colorChange: (color: string) => void;
}

const ColorPicker: FC<ColorPickerProps> = ({
  color = '#ffffff',
  colorChange,
}) => {
  const [visible, setVisible] = useState(false);
  const [pickerColor, setPickerColor] = useState<string>(color);
  const [boxColor, setBoxColor] = useState<string>(color);

  useEffect(() => {
    setBoxColor(color);
    setPickerColor(color);
  }, [color]);

  const onPickerDropdown = () => {
    setVisible(!visible);
  };

  const onColorChange: SketchPickerProps['onChange'] = (value) => {
    // const { rgb } = value;
    // const rgba = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b}, ${rgb.a || ''})`;
    // setBoxColor(rgba);
    // setPickerColor(rgb);

    const { hex } = value;
    setBoxColor(hex);
    setPickerColor(hex);
    colorChange(hex);
  };

  return (
    <div className='color-picker'>
      <div className='color-picker-dropdown'>
        <div
          className='color'
          role='none'
          style={{ backgroundColor: boxColor }}
          onClick={onPickerDropdown}
        />
      </div>
      {visible && (
        <>
          <div
            className='color-picker-backdrop'
            role='none'
            onClick={onPickerDropdown}
          />
          <SketchPicker color={pickerColor} onChange={onColorChange} />
        </>
      )}
    </div>
  );
};

export default ColorPicker;
