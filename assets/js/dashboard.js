/* =========================================================
   Admin Dashboard — revenue line chart + orders donut
   Rendering is done by the shared JPCharts module (charts.js)
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  const revenueData = {
    month:     { labels: ['May 1', 'May 7', 'May 14', 'May 21', 'May 28', 'May 31'], values: [5200, 7400, 8100, 11200, 9600, 14800, 12300, 13100, 15600, 19200] },
    lastMonth: { labels: ['Apr 1', 'Apr 7', 'Apr 14', 'Apr 21', 'Apr 28', 'Apr 30'], values: [4100, 5300, 6900, 6200, 8800, 8100, 10400, 9700, 12800, 14200] },
    quarter:   { labels: ['Mar', 'Mar 15', 'Mar 31', 'Apr 15', 'Apr 30', 'May 31'], values: [3600, 6100, 7800, 6900, 10200, 14200, 11800, 15100, 19200] },
    year:      { labels: ['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Dec'], values: [8200, 9600, 11400, 14200, 19200, 17800, 16400, 18900, 20400, 19100, 21600, 23800] }
  };

  const money = v => '$' + Number(v).toLocaleString();
  const lineHost = document.getElementById('revenueChart');
  const donutHost = document.getElementById('ordersDonut');
  const rangeSelect = document.getElementById('revenueRange');
  let activeRange = 'month';

  const drawLine = () => JPCharts.renderLine(lineHost, {
    labels: revenueData[activeRange].labels,
    values: revenueData[activeRange].values,
    yStep: 5000,
    color: '#1f6b4f',
    formatY: v => v === 0 ? '$0' : '$' + (v / 1000) + 'K',
    formatTip: money
  });

  drawLine();
  JPCharts.renderDonut(donutHost, [
    { label: 'Completed', value: 1850, color: '#1c9a5b' },
    { label: 'Pending',   value: 320,  color: '#e2a63c' },
    { label: 'Failed',    value: 120,  color: '#e0483f' },
    { label: 'Refunded',  value: 60,   color: '#c7ccd4' }
  ]);

  rangeSelect && rangeSelect.addEventListener('change', e => {
    activeRange = revenueData[e.target.value] ? e.target.value : 'month';
    drawLine();
    const total = revenueData[activeRange].values.reduce((a, b) => a + b, 0);
    JP.toast(`${e.target.options[e.target.selectedIndex].text}: ${money(total)} in revenue.`);
  });

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(drawLine, 150);
  });
});
