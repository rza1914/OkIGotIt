import { useLocation } from "react-router-dom";

export default function PathDebug() {
  const { pathname } = useLocation();
  return (
    <div style={{position:'fixed',left:8,bottom:8,background:'#000a',color:'#fff',padding:'4px 8px',borderRadius:8,fontSize:12,zIndex:99999}}>
      {pathname}
    </div>
  );
}