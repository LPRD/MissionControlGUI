import React, { Component } from "react";
import PropTypes from "prop-types";
import { DropdownButton, Panel, MenuItem } from "react-bootstrap";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import TypeItem from "./TypeItem";

import { setType } from "../actions/app-actions";

import graphTypes from "../constants/graph-types";

class Title extends Component {
  handleClick = value => {
    const { root } = this.props;

    this.props.setType({ key: root, value, item: "type" });
  };

  render() {
    const { title, type, root } = this.props;
    return (
      <DropdownButton id="title-dropdown" title={title}>
        <li>
          <Link to={`/${root}/view`}>View</Link>
        </li>
        <li>
          <Link to={`/${root}/layout`}>Layout</Link>
        </li>
        <li>
          <Link to={`/${root}/edit`}>Edit</Link>
        </li>
        <MenuItem>
          <Panel id="collapsible-type-panel" defaultExpanded>
            <Panel.Heading>
              {/* <Panel.Title toggle>Type</Panel.Title> */}
              <Panel.Title>Type</Panel.Title>
            </Panel.Heading>
            {/* commenting out 'toggle' in Panel.Title  resolves the following error: */}
            {/* index.js:2178 Warning: validateDOMNesting(...): <a> cannot appear as a descendant of <a>.
            in a (created by SafeAnchor)
            in SafeAnchor (created by PanelToggle)
            in PanelToggle (created by PanelTitle)
            in div (created by PanelTitle)
            in PanelTitle (at Title.js:36)      <------------
            in div (created by PanelHeading)
            in PanelHeading (at Title.js:35)
            in div (created by Panel)
            in Panel (created by Uncontrolled(Panel))
            in Uncontrolled(Panel) (at Title.js:34)
            in a (created by SafeAnchor)
            in SafeAnchor (created by MenuItem)
            in li (created by MenuItem)
            in MenuItem (at Title.js:33)
            in ul (created by DropdownMenu)
            in RootCloseWrapper (created by DropdownMenu)
            in DropdownMenu (created by Dropdown)
            in div (created by ButtonGroup)
            in ButtonGroup (created by Dropdown)
            in Dropdown (created by Uncontrolled(Dropdown))
            in Uncontrolled(Dropdown) (created by DropdownButton)
            in DropdownButton (at Title.js:23)
            in Title (created by Connect(Title))
            in Connect(Title) (at GridItem.js:23)
            in div (at GridItem.js:22)
            in div (at GridItem.js:21)
            in GridItem (at GridItemContainer.js:9)
            in GridItemContainer (created by Connect(GridItemContainer))
            in Connect(GridItemContainer) (at GridLayout.js:45)
            in Resizable (created by GridItem)
            in DraggableCore (created by GridItem)
            in GridItem (created by ReactGridLayout)
            in div (created by ReactGridLayout)
            in ReactGridLayout (created by ResponsiveReactGridLayout)
            in ResponsiveReactGridLayout (created by WidthProvider)
            in WidthProvider (at GridLayout.js:30)
            in GridLayout (created by Connect(GridLayout))
            in Connect(GridLayout) (at Dashboard.js:15)
            in div (at Dashboard.js:14)
            in Dashboard (created by Connect(Dashboard))
            in Connect(Dashboard) (created by Route)
            in Route (at index.js:27)
            in Switch (at index.js:24)
            in Router (at index.js:23)
            in Provider (at index.js:22)
            in App (at index.js:36) */}
            <Panel.Collapse>
              <Panel.Body>
                {graphTypes.map(({ label, value }) => {
                  return (
                    <TypeItem
                      key={value}
                      onClick={this.handleClick}
                      type={type}
                      value={value}
                      label={label}
                    />
                  );
                })}
              </Panel.Body>
            </Panel.Collapse>
          </Panel>
        </MenuItem>
      </DropdownButton>
    );
  }
}

Title.propTypes = {
  root: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired
};

export default connect(null, { setType })(Title);
