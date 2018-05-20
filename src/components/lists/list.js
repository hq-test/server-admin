import React from 'react';
import FieldRenderer from '../renderer/field.js';

const List = ({ items, options, onDelete, onView, onStart }) => (
  <div>
    <table style={{ width: '100%', marginTop: 10 }}>
      <thead style={{ backgroundColor: 'yellow', fontWeight: 'bold' }}>
        <tr>
          {options.map((optionItem, index) => {
            return <td key={index}>{optionItem.headerTitle}</td>;
          })}
          <td>Action</td>
        </tr>
      </thead>
      <tbody>
        {items.map(item => {
          return (
            <tr key={item.id}>
              {options.map((optionItem, index) => {
                return (
                  <td key={index}>
                    <FieldRenderer
                      type={optionItem.renderer}
                      value={item[optionItem.field]}
                      nested={optionItem.nested ? optionItem.nested : false}
                      nestedField={
                        optionItem.nestedField ? optionItem.nestedField : false
                      }
                    />
                  </td>
                );
              })}
              <td>
                {onStart && !item.isRunning ? (
                  <button onClick={() => onStart(item.id)}>Start</button>
                ) : null}
                {onView ? (
                  <button onClick={() => onView(item.id)}>View</button>
                ) : null}
                <button onClick={() => onDelete(item.id)}>Delete</button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

export default List;
