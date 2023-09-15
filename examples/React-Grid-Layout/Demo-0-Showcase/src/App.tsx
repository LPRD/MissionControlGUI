// @flow
import * as React from "react";
import _ from "lodash";
// import Responsive from '../../lib/ResponsiveReactGridLayout';
// import WidthProvider from '../../lib/components/WidthProvider';
import { Responsive, WidthProvider } from "react-grid-layout";
import type {CompactType, Layout, LayoutItem, ReactChildren} from './utils';
// import {CompactType, Layout, LayoutItem, ReactChildren} from "react-grid-layout";
import type {Breakpoint, OnLayoutChangeCallback} from './responsiveUtils';
const ResponsiveReactGridLayout = WidthProvider(Responsive);
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
//if I want to use the styles from the RGL examples
import "./styles.css";

type Props = {
  className: string,
  cols: {[string]: number},
  onLayoutChange: Function,
  rowHeight: number,
};
type State = {
  currentBreakpoint: string,
  compactType: CompactType,
  mounted: boolean,
  layouts: {[string]: Layout}
};

export default class ShowcaseLayout extends React.Component<Props, State> {
  static defaultProps: Props = {
    className: "layout",
    rowHeight: 30,
    onLayoutChange: function() {},
    cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
  };

  state: State = {
    currentBreakpoint: "lg",
    compactType: "vertical",
    mounted: false,
    layouts: { lg: generateLayout() }
  };

  componentDidMount() {
    this.setState({ mounted: true });
  }

  generateDOM(): ReactChildren {
    return _.map(this.state.layouts.lg, function(l, i) {
      return (
        <div 
          key={i}
          //can manually override styles for different classNames
          // style=
          //   {l.static ? (
          //     { background: "rgb(204, 255, 100)", border: "1px solid rgb(0, 0, 0)" }
          //   ) : (
          //     { background: "#bbb", border: "1px solid rgb(0, 0, 0)" }
          //   )}
          className={l.static ? "static" : ""}>
          {l.static ? (
            <span
              className="text"
              title="This item is static and cannot be removed or resized."
            >
              Static - {i}
            </span>
          ) : (
            <span className="text">{i}</span>
          )}
        </div>
      );
    });
  }

  onBreakpointChange: (Breakpoint) => void = (breakpoint) => {
    this.setState({
      currentBreakpoint: breakpoint
    });
  };

  onCompactTypeChange: () => void = () => {
    const { compactType: oldCompactType } = this.state;
    const compactType =
      oldCompactType === "horizontal"
        ? "vertical"
        : oldCompactType === "vertical"
        ? null
        : "horizontal";
    this.setState({ compactType });
  };

  onLayoutChange: OnLayoutChangeCallback = (layout, layouts) => {
    this.props.onLayoutChange(layout, layouts);
  };

  onNewLayout: EventHandler = () => {
    this.setState({
      layouts: { lg: generateLayout() }
    });
  };

  onDrop: (layout: Layout, item: LayoutItem, e: Event) => void = (elemParams) => {
    alert(`Element parameters: ${JSON.stringify(elemParams)}`);
  };

  render(): React.Node {
    // eslint-disable-next-line no-unused-vars
    return (
      <div>
        <div>
          Current Breakpoint: {this.state.currentBreakpoint} (
          {this.props.cols[this.state.currentBreakpoint]} columns)
        </div>
        <div>
          Compaction type:{" "}
          {_.capitalize(this.state.compactType) || "No Compaction"}
        </div>
        <button onClick={this.onNewLayout}>Generate New Layout</button>
        <button onClick={this.onCompactTypeChange}>
          Change Compaction Type
        </button>
        <ResponsiveReactGridLayout
          {...this.props}
          layouts={this.state.layouts}
          onBreakpointChange={this.onBreakpointChange}
          onLayoutChange={this.onLayoutChange}
          onDrop={this.onDrop}
          // WidthProvider option
          measureBeforeMount={false}
          // I like to have it animate on mount. If you don't, delete `useCSSTransforms` (it's default `true`)
          // and set `measureBeforeMount={true}`.
          useCSSTransforms={this.state.mounted}
          compactType={this.state.compactType}
          preventCollision={!this.state.compactType}
        >
          {this.generateDOM()}
        </ResponsiveReactGridLayout>
      </div>
    );
  }
}

function generateLayout() {
  return _.map(_.range(0, 25), function(item, i) {
    var y = Math.ceil(Math.random() * 4) + 1;
    return {
      x: Math.round(Math.random() * 5) * 2,
      y: Math.floor(i / 6) * y,
      w: 2,
      h: y,
      i: i.toString(),
      static: Math.random() < 0.05
    };
  });
}

// if (process.env.STATIC_EXAMPLES === true) {
//   import("./test-hook.jsx").then(fn => fn.default(ShowcaseLayout));
// }
