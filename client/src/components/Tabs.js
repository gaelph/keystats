import React, { useState } from "react";

export function Tab({ title: _title, children, active }) {
  return <li className={`tab ${active ? "active" : ""}`}>{children}</li>;
}

export function Tabs(props) {
  let { children } = props;
  const [activeTab, setActiveTab] = useState(0);

  if (!children) {
    return null;
  }
  if (!Array.isArray(children)) {
    children = [children];
  }

  const tabs = children.map((child, idx) =>
    React.cloneElement(child, {
      active: idx === activeTab,
    })
  );

  return (
    <div className="tabs">
      <div className="tabs-button">
        {tabs.map((child, idx) => (
          <button
            className={`tab-button ${idx === activeTab ? "active" : ""}`}
            onClick={(e) => {
              e.preventDefault();
              setActiveTab(idx);
            }}
          >
            {idx === activeTab ? "• " : ""}
            {child.props.title}
          </button>
        ))}
      </div>

      <ul className="tabs-content">{tabs}</ul>
    </div>
  );
}
