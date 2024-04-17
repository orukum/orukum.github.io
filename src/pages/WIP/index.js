import './index.less';

function numberOfDays(a, b) {
  return Math.abs(a.getTime() - b.getTime()) / (24 * 3600 * 1000);
}

function timeFrame(days) {
  if (days > 365)
    return 'years';
  if (days > 30)
    return 'months';
  if (days > 7)
    return 'weeks';
  if (days > 1)
    return 'days';
  return 'hours';
}

export default function ({start}) {
  const days = numberOfDays(new Date(), new Date(start));
  return <div class="wip">
    <h1>Will be right with you.</h1>
    <h2>Just <small>give <small>me <small>a <small>couple... <small>{timeFrame(days)}.</small></small></small></small></small></h2>
  </div>;
};