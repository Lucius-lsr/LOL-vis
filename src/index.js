import G6 from '@antv/g6';

const container = document.getElementById('container');
const width = container.scrollWidth;
const height = container.scrollHeight || 1000;
const graph = new G6.Graph({
    container: 'container',
    width,
    height,
    layout: {
        type: 'force',
        preventOverlap: true,
    },
    defaultNode: {
        type: 'image',
        style: {
            image: 'https://gw.alipayobjects.com/mdn/rms_f8c6a0/afts/img/A*eD7nT6tmYgAAAAAAAAAAAABkARQnAQ',
        },
        size: 30,
    },
    modes: {
        default: ['drag-canvas', 'zoom-canvas', 'drag-node', // 允许拖拽画布、放缩画布、拖拽节点
            {
                type: 'tooltip', // 提示框
                formatText(model) {
                    // 提示框文本内容
                    return '角色定位: ' + model.details["角色定位"] + '<br/>' +
                        '相关地区: ' + model.details["相关地区"] + '<br/>' +
                        '英文名: ' + model.details["en_name"] + '<br/>' +
                        '中文名: ' + model.details["zh_name"]
                },
            },
        ],
    },
});

fetch('relations.json')
    .then((res) => res.json())
    .then((data) => {
        graph.data({
            nodes: data.nodes,
            edges: data.edges.map(function (edge, i) {
                edge.id = 'edge' + i;
                return Object.assign({}, edge);
            }),
        });
        graph.render();

        graph.on('node:dragstart', function (e) {
            graph.layout();
            refreshDragedNodePosition(e);
        });
        graph.on('node:drag', function (e) {
            const forceLayout = graph.get('layoutController').layoutMethods[0];
            forceLayout.execute();
            refreshDragedNodePosition(e);
        });
        graph.on('node:dragend', function (e) {
            e.item.get('model').fx = null;
            e.item.get('model').fy = null;
        });

        if (typeof window !== 'undefined')
            window.onresize = () => {
                if (!graph || graph.get('destroyed')) return;
                if (!container || !container.scrollWidth || !container.scrollHeight) return;
                graph.changeSize(container.scrollWidth, container.scrollHeight);
            };
    });

function refreshDragedNodePosition(e) {
    const model = e.item.get('model');
    model.fx = e.x;
    model.fy = e.y;
}
