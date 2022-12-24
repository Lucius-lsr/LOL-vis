import G6 from '@antv/g6';

const container = document.getElementById('container');
const width = container.scrollWidth;
const height = container.scrollHeight || 1000;

let defaultData;
let regionData;
let jobData;
let curData;

function loadGraph(type) {
    const graph = new G6.Graph({
        container: 'container',
        width,
        height,
        layout: {
            type: 'force2',
            animate: false, // 设置为 false 可关闭布局动画
            maxSpeed: 100,
            linkDistance: 50,
            clustering: true,
            nodeClusterBy: 'cluster',
            clusterNodeStrength: 300,
        },
        defaultNode: {
            type: type,
            size: 20,
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
    return graph
}

function loadData(graph, data) {
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
    graph.on('node:dblclick', function(e) {
        const zh_name = e.item.get('model').id;
        const el = document.getElementById('wordcloud')
        el.style.display = 'block'
        el.setAttribute('src', 'imgs/'+zh_name+'.png')
    })

    if (typeof window !== 'undefined')
        window.onresize = () => {
            if (!graph || graph.get('destroyed')) return;
            if (!container || !container.scrollWidth || !container.scrollHeight) return;
            graph.changeSize(container.scrollWidth, container.scrollHeight);
        };

    function refreshDragedNodePosition(e) {
        const model = e.item.get('model');
        model.fx = e.x;
        model.fy = e.y;
    }
}

document.getElementById('classification').addEventListener('change', function (e) {
    graph.destroy()
    if (this.value === 'default') {
        graph = loadGraph('image')
        loadData(graph, defaultData)
        curData = defaultData
    } else if (this.value === 'region') {
        graph = loadGraph('circle')
        loadData(graph, regionData)
        curData = regionData
    } else if (this.value === 'job') {
        graph = loadGraph('rect')
        loadData(graph, jobData)
        curData = jobData
    }
});

document.getElementById('region_filter').addEventListener('change', function (e) {
    if (this.value === 'all') {
        graph.changeData({
            nodes: curData.nodes,
            edges: curData.edges
        })
    } else {
        let backup = JSON.stringify(curData)
        let keyword = this.value
        let filteredNodes = []
        const s = new Set();
        for (let i in curData.nodes) {
            let node = curData.nodes[i]
            if (node.region !== keyword) {
                node.size = 1
                node.label = ''
            } else {
                s.add(node.id)
            }
            filteredNodes.push(node)
        }
        let filteredEdges = []
        for (let i in curData.edges) {
            let edge = curData.edges[i]
            if (!s.has(edge.source) || !s.has(edge.target)) {
                edge.style.strokeOpacity = 0.1
            }
            filteredEdges.push(edge)
        }
        graph.changeData({
            nodes: filteredNodes,
            edges: filteredEdges,
        })
        curData = JSON.parse(backup)
        if (document.getElementById('classification').value === 'default') defaultData = curData
        else if (document.getElementById('classification').value === 'region') regionData = curData
        else if (document.getElementById('classification').value === 'job') jobData = curData
    }
});

document.getElementById('job_filter').addEventListener('change', function (e) {
    if (this.value === 'all') {
        graph.changeData({
            nodes: curData.nodes,
            edges: curData.edges
        })
    } else {
        let backup = JSON.stringify(curData)
        let keyword = this.value
        let filteredNodes = []
        const s = new Set();
        for (let i in curData.nodes) {
            let node = curData.nodes[i]
            if (node.job !== keyword) {
                node.size = 1
                node.label = ''
            } else {
                s.add(node.id)
            }
            filteredNodes.push(node)
        }
        let filteredEdges = []
        for (let i in curData.edges) {
            let edge = curData.edges[i]
            if (!s.has(edge.source) || !s.has(edge.target)) {
                edge.style.strokeOpacity = 0.1
            }
            filteredEdges.push(edge)
        }
        graph.changeData({
            nodes: filteredNodes,
            edges: filteredEdges,
        })
        curData = JSON.parse(backup)
        if (document.getElementById('classification').value === 'default') defaultData = curData
        else if (document.getElementById('classification').value === 'region') regionData = curData
        else if (document.getElementById('classification').value === 'job') jobData = curData
    }
});

fetch('relations_default.json')
    .then((res) => res.json())
    .then((data) => {
        defaultData = data
    })

fetch('relations_region.json')
    .then((res) => res.json())
    .then((data) => {
        regionData = data
    })

fetch('relations_job.json')
    .then((res) => res.json())
    .then((data) => {
        jobData = data
    })

let graph = loadGraph('image')

document.getElementById('container').addEventListener('click', function(e) {
    let el = document.getElementById('wordcloud');
    el.style.display = 'none'
}, true)

setTimeout(function () {
    loadData(graph, defaultData);
    curData = defaultData;
}, 1000);
