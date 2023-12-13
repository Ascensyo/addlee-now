import {Outlet} from "@remix-run/react"

export default function Foo() {
  return <div style={{width:200, height:200, background:"red"}}>
    <Outlet />
  </div>
}
