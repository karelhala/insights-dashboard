/* eslint-disable camelcase */
import { Chart, ChartAxis, ChartBar, ChartLegend, ChartStack, ChartTooltip } from '@patternfly/react-charts';
import { global_palette_gold_300, global_palette_gold_400, global_palette_orange_300, global_palette_red_200 } from '@patternfly/react-tokens';

import PropTypes from 'prop-types';
import React from 'react';
import { SEVERITY_MAP } from './Constants';
import { injectIntl } from 'react-intl';
import messages from '../../Messages';
import routerParams from '@redhat-cloud-services/frontend-components-utilities/files/RouterParams';

const StackChart = ({ history, data, intl }) => {
    const chartData = [
        { name: intl.formatMessage(messages.critical), y: data[SEVERITY_MAP.critical] },
        { name: intl.formatMessage(messages.important), y: data[SEVERITY_MAP.important] },
        { name: intl.formatMessage(messages.moderate), y: data[SEVERITY_MAP.moderate] },
        { name: intl.formatMessage(messages.low), y: data[SEVERITY_MAP.low] }];
    const colorScale = [
        global_palette_red_200.value,
        global_palette_orange_300.value,
        global_palette_gold_400.value,
        global_palette_gold_300.value
    ];
    const barWidth = 22;
    const legendData = chartData.map(item => ({ name: `${item.y} ${item.name}`, symbol: { type: null } }));
    const legendClick = () => [{
        target: 'labels',
        mutation: (data) => {
            const risk = data.datum.name.split(' ')[1].toLowerCase();
            history.push(`/advisor/recommendations?total_risk=${SEVERITY_MAP[risk]}&reports_shown=true&impacting=true&offset=0&limit=10`);
        }
    }];
    const labelComponent = () => <ChartTooltip text={ ({ datum }) => `${datum.name}: ${datum.y}` } constrainToVisibleArea />;

    return <React.Fragment>
        <Chart
            ariaDesc='Advisor recommendations by severity'
            ariaTitle='Advisor recommendations by severity'
            padding={ { left: 0, right: 0, bottom: 56, top: 20 } }
            width={ 500 }
            legendPosition="bottom-left"
            height={ 110 }
            legendComponent={ <ChartLegend
                data={ legendData }
                events={ [{
                    target: 'labels', eventHandlers: {
                        onClick: legendClick,
                        onMouseOver: () => {
                            return [{
                                mutation: (data) => {
                                    return {
                                        style: Object.assign({}, data.style, { cursor: 'pointer' })
                                    };
                                }
                            }];
                        }
                    }
                }] }
                orientation='horizontal'
                colorScale={ colorScale }
            /> }
        >
            <ChartAxis axisComponent={ <React.Fragment /> } />
            <ChartStack horizontal
                colorScale={ colorScale }>
                <ChartBar
                    barWidth={ barWidth } labelComponent={ labelComponent() }
                    data={ [{ name: chartData[0].name, y: chartData[0].y, x: 1, label: chartData[0].name }] }
                />
                <ChartBar
                    barWidth={ barWidth } labelComponent={ labelComponent() }
                    data={ [{ name: chartData[1].name, y: chartData[1].y, x: 1, label: chartData[1].name }] }
                />
                <ChartBar
                    barWidth={ barWidth } labelComponent={ labelComponent() }
                    data={ [{ name: chartData[2].name, y: chartData[2].y, x: 1, label: chartData[2].name }] }
                />
                <ChartBar
                    barWidth={ barWidth } labelComponent={ labelComponent() }
                    data={ [{ name: chartData[3].name, y: chartData[3].y, x: 1, label: chartData[3].name }] }
                />
            </ChartStack>
        </Chart>
    </React.Fragment>;
};

StackChart.propTypes = {
    history: PropTypes.object,
    data: PropTypes.object,
    intl: PropTypes.any
};

export default injectIntl(routerParams(StackChart));
