import React from "react";
import { T } from "../theme/themes";

export function Skeleton(props) {
  return <div className="skel" style={Object.assign({ height: props.h || 16, width: props.w || '100%', borderRadius: props.r || 12, '--fill': T.fill, '--fill2': T.fill2 }, props.style)} />;
}

export function SkeletonCard() {
  return (
    <div style={{ padding: 20, borderRadius: 24, background: T.card, border: '1.5px solid ' + T.border }}>
      <div className="flex items-center gap-3" style={{ marginBottom: 16 }}>
        <Skeleton w={48} h={48} r={16} />
        <div className="flex-1 space-y-2"><Skeleton h={14} w="60%" /><Skeleton h={10} w="40%" /></div>
      </div>
      <Skeleton h={40} />
    </div>
  );
}

export function SkeletonList(props) {
  var rows = props.rows || 4;
  return (
    <div style={{ padding: '0 20px' }}>
      {Array.from({ length: rows }).map(function (_, i) {
        return (
          <div key={i} className="flex items-center gap-3" style={{ padding: '14px 0', borderBottom: '1px solid ' + T.fill }}>
            <Skeleton w={44} h={44} r={14} />
            <div className="flex-1 space-y-2"><Skeleton h={13} w={120 + Math.random() * 80 + 'px'} /><Skeleton h={10} w="50%" /></div>
          </div>
        );
      })}
    </div>
  );
}
