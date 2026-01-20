import './Loading.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { PulseLoader } from 'react-spinners';

interface LoadingProps {
  label: string;
}

function Loading(props: LoadingProps) {
  return (
    <div className='loading-container'>
      <div className="loading-text">{props.label}</div>
      <div className='animation-container'>
        <PulseLoader
          color={"white"}
          size={5}
        />
      </div>
    </div>
  );
}

export default Loading;

