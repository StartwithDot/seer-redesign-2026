# Step 3 feature evidence

Each checklist item was traced through its route, component branch, callback and data adapter. Paths below record import reachability from the product entry; this does not assert browser interaction coverage. F059 and F099 remain incomplete; see AUDIT.md. Missing source facts retain explicit unavailable states.

| Feature | Result | Implementation | Import path |
|---|---|---|---|
| F001 | Source verified | [OpportunityApp.tsx:53](components/OpportunityApp.tsx#L53) | index → OpportunityApp |
| F002 | Source verified | [OpportunityApp.tsx:53](components/OpportunityApp.tsx#L53) | index → OpportunityApp |
| F003 | Source verified | [OpportunityApp.tsx:53](components/OpportunityApp.tsx#L53) | index → OpportunityApp |
| F004 | Source verified | [StatusStrip.tsx:16](components/StatusStrip.tsx#L16) | index → OpportunityApp → BoardView → StatusStrip |
| F005 | Source verified | [MarketHero.tsx:10](components/MarketHero.tsx#L10) | index → OpportunityApp → BoardView → MarketHero |
| F006 | Source verified | [ProtocolDrawer.tsx:4](components/ProtocolDrawer.tsx#L4) | index → OpportunityApp → ProtocolDrawer |
| F007 | Source verified | [HelpTour.tsx:7](components/HelpTour.tsx#L7) | index → OpportunityApp → HelpTour |
| F008 | Source verified | [CommandPalette.tsx:22](components/CommandPalette.tsx#L22) | index → OpportunityApp → CommandPalette |
| F009 | Source verified | [CommandPalette.tsx:22](components/CommandPalette.tsx#L22) | index → OpportunityApp → CommandPalette |
| F010 | Source verified | [AppearanceMenu.tsx:16](components/AppearanceMenu.tsx#L16) | index → OpportunityApp → HeaderActions → AppearanceMenu |
| F011 | Source verified | [OpportunityApp.tsx:53](components/OpportunityApp.tsx#L53) | index → OpportunityApp |
| F012 | Source verified | [WalletDrawer.tsx:22](components/WalletDrawer.tsx#L22) | index → OpportunityApp → WalletDrawer |
| F013 | Source verified | [WalletDrawer.tsx:22](components/WalletDrawer.tsx#L22) | index → OpportunityApp → WalletDrawer |
| F014 | Source verified | [WalletDrawer.tsx:22](components/WalletDrawer.tsx#L22) | index → OpportunityApp → WalletDrawer |
| F015 | Source verified | [HeaderActions.tsx:16](components/HeaderActions.tsx#L16) | index → OpportunityApp → HeaderActions |
| F016 | Source verified | [OpportunityApp.tsx:53](components/OpportunityApp.tsx#L53) | index → OpportunityApp |
| F017 | Source verified | [OpportunityApp.tsx:53](components/OpportunityApp.tsx#L53) | index → OpportunityApp |
| F018 | Source verified | [OverlayDialog.tsx:25](components/OverlayDialog.tsx#L25) | index → OpportunityApp → ArchiveView → OverlayDialog |
| F019 | Source verified | [BoardView.tsx:17](components/BoardView.tsx#L17) | index → OpportunityApp → BoardView |
| F020 | Source verified | [MarketHero.tsx:10](components/MarketHero.tsx#L10) | index → OpportunityApp → BoardView → MarketHero |
| F021 | Source verified | [MarketRail.tsx:10](components/MarketRail.tsx#L10) | index → OpportunityApp → BoardView → MarketRail |
| F022 | Source verified | [MarketTicker.tsx:10](components/MarketTicker.tsx#L10) | index → OpportunityApp → BoardView → MarketTicker |
| F023 | Source verified | [useSelectedMarket.ts:15](hooks/useSelectedMarket.ts#L15) | index → OpportunityApp → BoardView → useSelectedMarket |
| F024 | Source verified | [MarketRail.tsx:10](components/MarketRail.tsx#L10) | index → OpportunityApp → BoardView → MarketRail |
| F025 | Source verified | [MarketRail.tsx:10](components/MarketRail.tsx#L10) | index → OpportunityApp → BoardView → MarketRail |
| F026 | Source verified | [BoardSignalStrip.tsx:7](components/BoardSignalStrip.tsx#L7) | index → OpportunityApp → BoardView → SignalSummary → BoardSignalStrip |
| F027 | Source verified | [BoardCoverage.tsx:7](components/BoardCoverage.tsx#L7) | index → OpportunityApp → BoardView → SignalSummary → BoardCoverage |
| F028 | Source verified | [BoardSignalStrip.tsx:7](components/BoardSignalStrip.tsx#L7) | index → OpportunityApp → BoardView → SignalSummary → BoardSignalStrip |
| F029 | Source verified | [BoardSignalStrip.tsx:7](components/BoardSignalStrip.tsx#L7) | index → OpportunityApp → BoardView → SignalSummary → BoardSignalStrip |
| F030 | Source verified | [DecisionRail.tsx:8](components/DecisionRail.tsx#L8) | index → OpportunityApp → BoardView → DecisionRail |
| F031 | Source verified | [DecisionRail.tsx:8](components/DecisionRail.tsx#L8) | index → OpportunityApp → BoardView → DecisionRail |
| F032 | Source verified | [StatusStrip.tsx:16](components/StatusStrip.tsx#L16) | index → OpportunityApp → BoardView → StatusStrip |
| F033 | Source verified | [BoardDataState.tsx:6](components/BoardDataState.tsx#L6) | index → OpportunityApp → BoardView → BoardDataState |
| F034 | Source verified | [BoardDataState.tsx:6](components/BoardDataState.tsx#L6) | index → OpportunityApp → BoardView → BoardDataState |
| F035 | Source verified | [BoardDataState.tsx:6](components/BoardDataState.tsx#L6) | index → OpportunityApp → BoardView → BoardDataState |
| F036 | Source verified | [ExplorerView.tsx:28](components/ExplorerView.tsx#L28) | index → OpportunityApp → ExplorerView |
| F037 | Source verified | [ExplorerFilterBar.tsx:61](components/ExplorerFilterBar.tsx#L61) | index → OpportunityApp → ExplorerView → ExplorerFilters → ExplorerFilterBar |
| F038 | Source verified | [ExplorerFilterBar.tsx:61](components/ExplorerFilterBar.tsx#L61) | index → OpportunityApp → ExplorerView → ExplorerFilters → ExplorerFilterBar |
| F039 | Source verified | [ExplorerFilterBar.tsx:61](components/ExplorerFilterBar.tsx#L61) | index → OpportunityApp → ExplorerView → ExplorerFilters → ExplorerFilterBar |
| F040 | Source verified | [ExplorerFilterBar.tsx:61](components/ExplorerFilterBar.tsx#L61) | index → OpportunityApp → ExplorerView → ExplorerFilters → ExplorerFilterBar |
| F041 | Source verified | [ExplorerFilterBar.tsx:61](components/ExplorerFilterBar.tsx#L61) | index → OpportunityApp → ExplorerView → ExplorerFilters → ExplorerFilterBar |
| F042 | Source verified | [ExplorerFilterBar.tsx:61](components/ExplorerFilterBar.tsx#L61) | index → OpportunityApp → ExplorerView → ExplorerFilters → ExplorerFilterBar |
| F043 | Source verified | [ExplorerResultsHeader.tsx:36](components/ExplorerResultsHeader.tsx#L36) | index → OpportunityApp → ExplorerView → ExplorerResultsHeader |
| F044 | Source verified | [ExplorerResultsHeader.tsx:36](components/ExplorerResultsHeader.tsx#L36) | index → OpportunityApp → ExplorerView → ExplorerResultsHeader |
| F045 | Source verified | [ExplorerFilterBar.tsx:61](components/ExplorerFilterBar.tsx#L61) | index → OpportunityApp → ExplorerView → ExplorerFilters → ExplorerFilterBar |
| F046 | Source verified | [useExplorerQueryState.ts:83](hooks/useExplorerQueryState.ts#L83) | index → OpportunityApp → ExplorerView → useExplorerQueryState |
| F047 | Source verified | [ExplorerResultsHeader.tsx:36](components/ExplorerResultsHeader.tsx#L36) | index → OpportunityApp → ExplorerView → ExplorerResultsHeader |
| F048 | Source verified | [ExplorerLedger.tsx:22](components/ExplorerLedger.tsx#L22) | index → OpportunityApp → ExplorerView → ExplorerLedger |
| F049 | Source verified | [ExplorerRecordDrawer.tsx:13](components/ExplorerRecordDrawer.tsx#L13) | index → OpportunityApp → ExplorerView → ExplorerRecordDrawer |
| F050 | Source verified | [MarketTimeline.tsx:25](components/MarketTimeline.tsx#L25) | index → OpportunityApp → ArchiveView → MarketDossierPanel → MarketTimeline |
| F051 | Source verified | [RecordActions.tsx:10](components/RecordActions.tsx#L10) | index → OpportunityApp → ArchiveView → MarketDossierPanel → RecordActions |
| F052 | Source verified | [ExplorerDataState.tsx:9](components/ExplorerDataState.tsx#L9) | index → OpportunityApp → ExplorerView → ExplorerDataState |
| F053 | Source verified | [MarketDossierPanel.tsx:16](components/MarketDossierPanel.tsx#L16) | index → OpportunityApp → ArchiveView → MarketDossierPanel |
| F054 | Source verified | [MarketDossierPanel.tsx:16](components/MarketDossierPanel.tsx#L16) | index → OpportunityApp → ArchiveView → MarketDossierPanel |
| F055 | Source verified | [MarketDossierPanel.tsx:16](components/MarketDossierPanel.tsx#L16) | index → OpportunityApp → ArchiveView → MarketDossierPanel |
| F056 | Source verified | [MarketDossierPanel.tsx:16](components/MarketDossierPanel.tsx#L16) | index → OpportunityApp → ArchiveView → MarketDossierPanel |
| F057 | Source verified | [ReviewSubmissionDossier.tsx:24](components/ReviewSubmissionDossier.tsx#L24) | index → OpportunityApp → ReviewView → ReviewSubmissionDossier |
| F058 | Source verified | [SubmissionDossierPanel.tsx:20](components/SubmissionDossierPanel.tsx#L20) | index → OpportunityApp → ExplorerView → ExplorerRecordDrawer → SubmissionDossierPanel |
| F059 | Incomplete | [SubmissionDossierPanel.tsx:20](components/SubmissionDossierPanel.tsx#L20) | index → OpportunityApp → ExplorerView → ExplorerRecordDrawer → SubmissionDossierPanel |
| F060 | Source verified | [SubmissionDossierPanel.tsx:20](components/SubmissionDossierPanel.tsx#L20) | index → OpportunityApp → ExplorerView → ExplorerRecordDrawer → SubmissionDossierPanel |
| F061 | Source verified | [SubmissionEvidencePanel.tsx:9](components/SubmissionEvidencePanel.tsx#L9) | index → OpportunityApp → ReviewView → ReviewSubmissionDossier → SubmissionEvidencePanel |
| F062 | Source verified | [SponsorReviewPanel.tsx:12](components/SponsorReviewPanel.tsx#L12) | index → OpportunityApp → ReviewView → ReviewSubmissionDossier → SponsorReviewPanel |
| F063 | Source verified | [SubmissionCommunityPanel.tsx:14](components/SubmissionCommunityPanel.tsx#L14) | index → OpportunityApp → ReviewView → ReviewSubmissionDossier → SubmissionCommunityPanel |
| F064 | Source verified | [SubmissionTimelinePanel.tsx:53](components/SubmissionTimelinePanel.tsx#L53) | index → OpportunityApp → ReviewView → ReviewSubmissionDossier → SubmissionTimelinePanel |
| F065 | Source verified | [ValueState.tsx:17](components/ValueState.tsx#L17) | index → OpportunityApp → ReviewView → ReviewCutView → ValueState |
| F066 | Source verified | [ReviewField.tsx:5](components/ReviewField.tsx#L5) | index → OpportunityApp → ReviewView → ReviewField |
| F067 | Source verified | [ReviewField.tsx:5](components/ReviewField.tsx#L5) | index → OpportunityApp → ReviewView → ReviewField |
| F068 | Source verified | [ReviewField.tsx:5](components/ReviewField.tsx#L5) | index → OpportunityApp → ReviewView → ReviewField |
| F069 | Source verified | [ReviewField.tsx:5](components/ReviewField.tsx#L5) | index → OpportunityApp → ReviewView → ReviewField |
| F070 | Source verified | [ReviewField.tsx:5](components/ReviewField.tsx#L5) | index → OpportunityApp → ReviewView → ReviewField |
| F071 | Source verified | [ReviewField.tsx:5](components/ReviewField.tsx#L5) | index → OpportunityApp → ReviewView → ReviewField |
| F072 | Source verified | [ReviewField.tsx:5](components/ReviewField.tsx#L5) | index → OpportunityApp → ReviewView → ReviewField |
| F073 | Source verified | [ReviewField.tsx:5](components/ReviewField.tsx#L5) | index → OpportunityApp → ReviewView → ReviewField |
| F074 | Source verified | [ReviewField.tsx:5](components/ReviewField.tsx#L5) | index → OpportunityApp → ReviewView → ReviewField |
| F075 | Source verified | [ReviewField.tsx:5](components/ReviewField.tsx#L5) | index → OpportunityApp → ReviewView → ReviewField |
| F076 | Source verified | [ReviewField.tsx:5](components/ReviewField.tsx#L5) | index → OpportunityApp → ReviewView → ReviewField |
| F077 | Source verified | [useReviewPreferences.ts:56](hooks/useReviewPreferences.ts#L56) | index → OpportunityApp → ReviewView → useReviewPreferences |
| F078 | Source verified | [ReviewList.tsx:51](components/ReviewList.tsx#L51) | index → OpportunityApp → ReviewView → ReviewList |
| F079 | Source verified | [ReviewListRows.tsx:102](components/ReviewListRows.tsx#L102) | index → OpportunityApp → ReviewView → ReviewList → ReviewListRows |
| F080 | Source verified | [ReviewListRows.tsx:102](components/ReviewListRows.tsx#L102) | index → OpportunityApp → ReviewView → ReviewList → ReviewListRows |
| F081 | Source verified | [ReviewListControls.tsx:15](components/ReviewListControls.tsx#L15) | index → OpportunityApp → ReviewView → ReviewList → ReviewListControls |
| F082 | Source verified | [ReviewListRows.tsx:102](components/ReviewListRows.tsx#L102) | index → OpportunityApp → ReviewView → ReviewList → ReviewListRows |
| F083 | Source verified | [ReviewListRows.tsx:102](components/ReviewListRows.tsx#L102) | index → OpportunityApp → ReviewView → ReviewList → ReviewListRows |
| F084 | Source verified | [ReviewListRows.tsx:102](components/ReviewListRows.tsx#L102) | index → OpportunityApp → ReviewView → ReviewList → ReviewListRows |
| F085 | Source verified | [ReviewListControls.tsx:15](components/ReviewListControls.tsx#L15) | index → OpportunityApp → ReviewView → ReviewList → ReviewListControls |
| F086 | Source verified | [ReviewListPagination.tsx:10](components/ReviewListPagination.tsx#L10) | index → OpportunityApp → ReviewView → ReviewList → ReviewListPagination |
| F087 | Source verified | [ReviewListRows.tsx:102](components/ReviewListRows.tsx#L102) | index → OpportunityApp → ReviewView → ReviewList → ReviewListRows |
| F088 | Source verified | [ReviewCutControls.tsx:21](components/ReviewCutControls.tsx#L21) | index → OpportunityApp → ReviewView → ReviewCutView → ReviewCutControls |
| F089 | Source verified | [ReviewCutSummary.tsx:10](components/ReviewCutSummary.tsx#L10) | index → OpportunityApp → ReviewView → ReviewCutView → ReviewCutSummary |
| F090 | Source verified | [ReviewCutSummary.tsx:10](components/ReviewCutSummary.tsx#L10) | index → OpportunityApp → ReviewView → ReviewCutView → ReviewCutSummary |
| F091 | Source verified | [ReviewCutControls.tsx:21](components/ReviewCutControls.tsx#L21) | index → OpportunityApp → ReviewView → ReviewCutView → ReviewCutControls |
| F092 | Source verified | [ShortlistDrawer.tsx:18](components/ShortlistDrawer.tsx#L18) | index → OpportunityApp → ReviewView → ShortlistDrawer |
| F093 | Source verified | [ShortlistDrawer.tsx:18](components/ShortlistDrawer.tsx#L18) | index → OpportunityApp → ReviewView → ShortlistDrawer |
| F094 | Source verified | [useReviewWorkspace.ts:29](hooks/useReviewWorkspace.ts#L29) | index → OpportunityApp → ReviewView → useReviewWorkspace |
| F095 | Source verified | [ReviewCutRecommendation.tsx:10](components/ReviewCutRecommendation.tsx#L10) | index → OpportunityApp → ReviewView → ReviewCutView → ReviewCutRecommendation |
| F096 | Source verified | [ReviewCompareDialog.tsx:13](components/ReviewCompareDialog.tsx#L13) | index → OpportunityApp → ReviewView → ReviewCompareDialog |
| F097 | Source verified | [SponsorDecisionDrawer.tsx:34](components/SponsorDecisionDrawer.tsx#L34) | index → OpportunityApp → ReviewView → SponsorDecisionDrawer |
| F098 | Source verified | [SponsorDecisionDrawer.tsx:34](components/SponsorDecisionDrawer.tsx#L34) | index → OpportunityApp → ReviewView → SponsorDecisionDrawer |
| F099 | Incomplete | [SponsorDecisionDrawer.tsx:34](components/SponsorDecisionDrawer.tsx#L34) | index → OpportunityApp → ReviewView → SponsorDecisionDrawer |
| F100 | Source verified | [DecisionLane.tsx:20](components/DecisionLane.tsx#L20) | index → OpportunityApp → ReviewView → DecisionLane |
| F101 | Source verified | [DecisionStepper.tsx:18](components/DecisionStepper.tsx#L18) | index → OpportunityApp → ReviewView → DecisionLane → DecisionStepper |
| F102 | Source verified | [DecisionStepper.tsx:18](components/DecisionStepper.tsx#L18) | index → OpportunityApp → ReviewView → DecisionLane → DecisionStepper |
| F103 | Source verified | [SponsorAuthorityPanel.tsx:9](components/SponsorAuthorityPanel.tsx#L9) | index → OpportunityApp → ReviewView → DecisionLane → SponsorAuthorityPanel |
| F104 | Source verified | [DecisionLane.tsx:20](components/DecisionLane.tsx#L20) | index → OpportunityApp → ReviewView → DecisionLane |
| F105 | Source verified | [ResolutionContext.tsx:7](components/ResolutionContext.tsx#L7) | index → OpportunityApp → ReviewView → DecisionLane → ResolutionContext |
| F106 | Source verified | [SubmissionDossierDrawer.tsx:27](components/SubmissionDossierDrawer.tsx#L27) | index → OpportunityApp → ReviewView → SubmissionDossierDrawer |
| F107 | Source verified | [ReviewSubmissionDossier.tsx:24](components/ReviewSubmissionDossier.tsx#L24) | index → OpportunityApp → ReviewView → ReviewSubmissionDossier |
| F108 | Source verified | [SubmissionPriceChart.tsx:24](components/SubmissionPriceChart.tsx#L24) | index → OpportunityApp → ReviewView → ReviewSubmissionDossier → SubmissionPriceChart |
| F109 | Source verified | [SubmissionTimelinePanel.tsx:53](components/SubmissionTimelinePanel.tsx#L53) | index → OpportunityApp → ReviewView → ReviewSubmissionDossier → SubmissionTimelinePanel |
| F110 | Source verified | [SubmissionExternalLinks.tsx:9](components/SubmissionExternalLinks.tsx#L9) | index → OpportunityApp → ReviewView → ReviewSubmissionDossier → SubmissionExternalLinks |
| F111 | Source verified | [SubmissionCommunityPanel.tsx:14](components/SubmissionCommunityPanel.tsx#L14) | index → OpportunityApp → ReviewView → ReviewSubmissionDossier → SubmissionCommunityPanel |
| F112 | Source verified | [SubmissionActionBar.tsx:15](components/SubmissionActionBar.tsx#L15) | index → OpportunityApp → ReviewView → SubmissionDossierDrawer → SubmissionActionBar |
| F113 | Source verified | [SubmissionDossierDrawer.tsx:27](components/SubmissionDossierDrawer.tsx#L27) | index → OpportunityApp → ReviewView → SubmissionDossierDrawer |
| F114 | Source verified | [TradeDrawer.tsx:21](components/TradeDrawer.tsx#L21) | index → OpportunityApp → ReviewView → TradeDrawer |
| F115 | Source verified | [TradeDrawer.tsx:21](components/TradeDrawer.tsx#L21) | index → OpportunityApp → ReviewView → TradeDrawer |
| F116 | Source verified | [TradeDrawer.tsx:21](components/TradeDrawer.tsx#L21) | index → OpportunityApp → ReviewView → TradeDrawer |
| F117 | Source verified | [TradeDrawer.tsx:21](components/TradeDrawer.tsx#L21) | index → OpportunityApp → ReviewView → TradeDrawer |
| F118 | Source verified | [LiveTradeQuoteSummary.tsx:4](components/LiveTradeQuoteSummary.tsx#L4) | index → OpportunityApp → ReviewView → TradeDrawer → LiveTradeQuoteSummary |
| F119 | Source verified | [useLiveTrade.ts:6](hooks/useLiveTrade.ts#L6) | index → OpportunityApp → ReviewView → TradeDrawer → useLiveTrade |
| F120 | Source verified | [TradeDrawer.tsx:21](components/TradeDrawer.tsx#L21) | index → OpportunityApp → ReviewView → TradeDrawer |
| F121 | Source verified | [TradeDrawer.tsx:21](components/TradeDrawer.tsx#L21) | index → OpportunityApp → ReviewView → TradeDrawer |
| F122 | Source verified | [TradeConfirmation.tsx:8](components/TradeConfirmation.tsx#L8) | index → OpportunityApp → ReviewView → TradeDrawer → TradeConfirmation |
| F123 | Source verified | [RedeemDrawer.tsx:9](components/RedeemDrawer.tsx#L9) | index → OpportunityApp → ArchiveView → MarketDossierPanel → ArchivePositions → RedeemDrawer |
| F124 | Source verified | [RedeemDrawer.tsx:9](components/RedeemDrawer.tsx#L9) | index → OpportunityApp → ArchiveView → MarketDossierPanel → ArchivePositions → RedeemDrawer |
| F125 | Source verified | [MarketAnalytics.tsx:8](components/MarketAnalytics.tsx#L8) | index → OpportunityApp → ArchiveView → MarketDossierPanel → MarketAnalytics |
| F126 | Source verified | [MarketAnalytics.tsx:8](components/MarketAnalytics.tsx#L8) | index → OpportunityApp → ArchiveView → MarketDossierPanel → MarketAnalytics |
| F127 | Source verified | [MarketAnalytics.tsx:8](components/MarketAnalytics.tsx#L8) | index → OpportunityApp → ArchiveView → MarketDossierPanel → MarketAnalytics |
| F128 | Source verified | [MarketAnalytics.tsx:8](components/MarketAnalytics.tsx#L8) | index → OpportunityApp → ArchiveView → MarketDossierPanel → MarketAnalytics |
| F129 | Source verified | [SubmissionPriceChart.tsx:24](components/SubmissionPriceChart.tsx#L24) | index → OpportunityApp → ReviewView → ReviewSubmissionDossier → SubmissionPriceChart |
| F130 | Source verified | [AnalysisPlot.tsx:6](components/AnalysisPlot.tsx#L6) | index → OpportunityApp → ArchiveView → MarketDossierPanel → MarketAnalytics → AnalysisPlot |
| F131 | Source verified | [ChartWindowControls.tsx:3](components/ChartWindowControls.tsx#L3) | index → OpportunityApp → ReviewView → ReviewSubmissionDossier → SubmissionPriceChart → ChartWindowControls |
| F132 | Source verified | [useChartEvidence.ts:5](hooks/useChartEvidence.ts#L5) | index → OpportunityApp → ReviewView → ReviewSubmissionDossier → SubmissionPriceChart → useChartEvidence |
| F133 | Source verified | [ArchiveView.tsx:9](components/ArchiveView.tsx#L9) | index → OpportunityApp → ArchiveView |
| F134 | Source verified | [ArchiveView.tsx:9](components/ArchiveView.tsx#L9) | index → OpportunityApp → ArchiveView |
| F135 | Source verified | [ArchiveResolution.tsx:4](components/ArchiveResolution.tsx#L4) | index → OpportunityApp → ArchiveView → MarketDossierPanel → ArchiveResolution |
| F136 | Source verified | [ArchiveGallery.tsx:6](components/ArchiveGallery.tsx#L6) | index → OpportunityApp → ArchiveView → MarketDossierPanel → ArchiveGallery |
| F137 | Source verified | [GalleryLightbox.tsx:7](components/GalleryLightbox.tsx#L7) | index → OpportunityApp → ArchiveView → MarketDossierPanel → ArchiveGallery → GalleryLightbox |
| F138 | Source verified | [ArchivePositions.tsx:7](components/ArchivePositions.tsx#L7) | index → OpportunityApp → ArchiveView → MarketDossierPanel → ArchivePositions |
| F139 | Source verified | [SubmissionCommunityPanel.tsx:14](components/SubmissionCommunityPanel.tsx#L14) | index → OpportunityApp → ReviewView → ReviewSubmissionDossier → SubmissionCommunityPanel |
| F140 | Source verified | [SubmissionExternalLinks.tsx:9](components/SubmissionExternalLinks.tsx#L9) | index → OpportunityApp → ReviewView → ReviewSubmissionDossier → SubmissionExternalLinks |
| F141 | Source verified | [OpportunityApp.tsx:53](components/OpportunityApp.tsx#L53) | index → OpportunityApp |
| F142 | Source verified | [OpportunityApp.tsx:53](components/OpportunityApp.tsx#L53) | index → OpportunityApp |
| F143 | Source verified | [ExplorerFilters.tsx:5](components/ExplorerFilters.tsx#L5) | index → OpportunityApp → ExplorerView → ExplorerFilters |
| F144 | Source verified | [SubmissionDossierDrawer.tsx:27](components/SubmissionDossierDrawer.tsx#L27) | index → OpportunityApp → ReviewView → SubmissionDossierDrawer |
| F145 | Source verified | [RouteAnnouncement.tsx:4](components/RouteAnnouncement.tsx#L4) | index → OpportunityApp → RouteAnnouncement |
| F146 | Source verified | [RouteStates.tsx:3](components/RouteStates.tsx#L3) | index → OpportunityApp → RouteStates |
| F147 | Source verified | [WalletDrawer.tsx:22](components/WalletDrawer.tsx#L22) | index → OpportunityApp → WalletDrawer |
| F148 | Source verified | [sampleMarkets.ts:14](data/sampleMarkets.ts#L14) | index → OpportunityApp → GuidedTour → markets → sampleMarkets |
| F149 | Source verified | [useOpportunityRoute.ts:10](hooks/useOpportunityRoute.ts#L10) | index → OpportunityApp → useOpportunityRoute |
| F150 | Source verified | [useReviewPreferences.ts:56](hooks/useReviewPreferences.ts#L56) | index → OpportunityApp → ReviewView → useReviewPreferences |
| F151 | Source verified | [MarketExplainer.tsx:5](components/MarketExplainer.tsx#L5) | index → OpportunityApp → HelpTour → MarketExplainer |
| F152 | Source verified | [ExplorerSearchResults.tsx:13](components/ExplorerSearchResults.tsx#L13) | index → OpportunityApp → ExplorerView → ExplorerSearchResults |
| F153 | Source verified | [MarketRail.tsx:10](components/MarketRail.tsx#L10) | index → OpportunityApp → BoardView → MarketRail |
| F154 | Source verified | [OpportunityApp.tsx:53](components/OpportunityApp.tsx#L53) | index → OpportunityApp |
| F155 | Source verified | [ProtocolDrawer.tsx:4](components/ProtocolDrawer.tsx#L4) | index → OpportunityApp → ProtocolDrawer |
| F156 | Source verified | [MarketExplainer.tsx:20](components/MarketExplainer.tsx#L20) | index → OpportunityApp → HelpTour → MarketExplainer |
| F157 | Source verified | [MarketHero.tsx:10](components/MarketHero.tsx#L10) | index → OpportunityApp → BoardView → MarketHero |
| F158 | Source verified | [SubmissionDossierPanel.tsx:20](components/SubmissionDossierPanel.tsx#L20) | index → OpportunityApp → ExplorerView → ExplorerRecordDrawer → SubmissionDossierPanel |
