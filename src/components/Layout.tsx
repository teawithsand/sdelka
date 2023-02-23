import React, { ReactNode } from "react"

import { wrapNoSSR } from "@teawithsand/tws-stl-react"
import { SSRProvider } from "react-bootstrap"

const InnerLayout = (props: { children: ReactNode }) => {
	return <SSRProvider>{props.children}</SSRProvider>
}

export const Layout = wrapNoSSR(InnerLayout)
