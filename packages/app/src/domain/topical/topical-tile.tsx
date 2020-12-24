import css from "@styled-system/css"
import { ReactNode } from "react";
import styled from "styled-components"
import { asResponsiveArray } from "~/style/utils";
import { TopicalRow } from "./topical-row";

interface TopicalTileProps {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}

export function TopicalTile({ icon, title, children }: TopicalTileProps) {
  return <TopicalTileWrapper>
    <IconWrapper>{icon}</IconWrapper>
    <TopicalHeader>{title}</TopicalHeader>
    {children}
  </TopicalTileWrapper>
}

const TopicalTileWrapper = styled.div(css({
  position: 'relative',
  pr: 2,
  pl: asResponsiveArray({ _: 0, md: '3.5rem' }),
  [`${TopicalRow} &`]: {
    flex: '1 0 30%'
  }
}));

const TopicalHeader = styled.h3(css({
  fontSize: '1.25rem',
  mt: 2,
  mb: 2,
  pl: asResponsiveArray({ _: '3.5rem', md: 0 }),
}));

const IconWrapper = styled.div(css({
  position: 'absolute',
  left: 0
}));
