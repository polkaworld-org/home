import React from 'react';
import styled from 'styled-components';

function IconBox ({ className, icon}) {
  return (
    <div className={className}>
      <div className='outer-icon'>{icon}</div>
    </div>
  );
}

export default styled(IconBox)`
  .outer-icon {
    width: 50px;
  }
  .container {
    padding: 0;
  }
`;
