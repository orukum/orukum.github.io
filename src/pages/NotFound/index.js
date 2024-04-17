import './index.less';
import { useParams } from '@solidjs/router';


export default function () {
  const { path } = useParams();

  return <div class="not-found">
    <p>I'm not sure what <strong>"{path}"</strong> is supposed to be, but it's not here.</p>
    <p>Consider this blindingly white page punishment for your ill-conceived curiosity.</p>
  </div>;
};