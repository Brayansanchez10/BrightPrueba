import React, {useState, useEffect} from "react";
import * as BsIcons from 'react-icons/ai';

const IconSelector = ({ onSelectIcon, selectedIcon  }) => {
    // Se combierten en un array para poder mapearlos
    const iconComponents = Object.keys(BsIcons).map((iconName) => {
        const IconComponent = BsIcons[iconName];
        const isSelected = selectedIcon === iconName;

        return (
            <button
                key={iconName}
                type="button"
                onClick={() => onSelectIcon(iconName)}
                style={{
                    margin: '5px',
                    fontSize: '24px',
                    padding: '8px',
                    borderRadius: '5px',
                    backgroundColor: isSelected ? '#D1E8FF' : 'transparent', // Fondo azul claro si está seleccionado
                    border: isSelected ? '2px solid #1E90FF' : '2px solid transparent', // Borde azul si está seleccionado
                }}
            >
                <IconComponent />
            </button>
        );
    });

    return < div style={{ display:'flex', flexWrap: 'wrap' }}>{iconComponents}</div>;
};

export default IconSelector;