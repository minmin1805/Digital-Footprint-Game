/**
 * Designer credit line — shown on Welcome and on the completion modal (GameEndPopup).
 * (This repo does not use a routed “endgame” URL; completion is GamePage + GameEndPopup.)
 */
export function DesignerCreditLine({ className = '' }) {
  return (
    <p className={className}>
      Design &amp; development by Minh Doan
    </p>
  )
}
