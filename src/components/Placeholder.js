import * as React from 'react'

const Placeholder = ({ title, props, children, addStyles }) => (
    <div style={{ outline: '1px dashed blue', padding: '10px', margin: '10px', ...addStyles }}>
        <h4 style={{ color: "steelblue"}}>{title}</h4>
        {props ? (
            <pre style={{ maxHeight: 200, overflow: "auto" }}>{JSON.stringify(props, null, 2)}</pre>
        ) : null}
        {children}
    </div>
)

export default Placeholder