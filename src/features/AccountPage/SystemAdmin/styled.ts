import styled from "styled-components";
import { Button } from "../../../common/Button";
import { StyledSpan } from "../../../common/StyledList";

export const SectionContainer = styled.div`
  margin-bottom: 20px;
  width: 100%;
`;

export const TopBorderSection = styled(SectionContainer)<{
  $noBorder?: boolean;
}>`
  border-top: ${({ theme, $noBorder }) =>
    $noBorder ? "none" : `1px solid ${theme.colors.border.primary}`};
  padding-top: ${({ $noBorder }) => ($noBorder ? "0" : "20px")};
`;

export const SectionTitle = styled.h3`
  font-size: 1.1rem;
  line-height: 1.4;
  margin-bottom: 10px;
`;

export const SubSectionContainer = styled.div`
  width: 100%;
`;

export const SpacerContainer = styled.div`
  margin-top: 15px;
  width: 100%;
`;

export const FlexStatsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 15px;
`;

export const FlexCenteredContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

export const FlexColumnStartContainer = styled.div`
  margin-top: 15px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

// ProgressBar components
export const ProgressBarLabel = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  margin-bottom: 6px;
  opacity: 0.8;

  @media (max-width: ${({ theme }) => theme.breakpoint.mobileMax}) {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
`;

export const ProgressBarTrack = styled.div`
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 15px;
`;

export const ProgressBarFill = styled.div<{ $width: number; $color: string }>`
  width: ${({ $width }) => $width}%;
  height: 100%;
  background: ${({ $color }) => $color};
  transition: width 0.5s ease-in-out;
`;

export const StatsRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: ${({ theme }) => theme.breakpoint.mobileMax}) {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px 20px;
  font-size: 0.8rem;
  opacity: 0.8;
  background: rgba(0, 0, 0, 0.1);
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 15px;

  @media (max-width: ${({ theme }) => theme.breakpoint.mobileMax}) {
    grid-template-columns: 1fr;
    gap: 10px;
  }
`;

export const StatsGridLarge = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px 20px;
  font-size: 0.85rem;
  background: rgba(0, 0, 0, 0.1);
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 20px;

  @media (max-width: ${({ theme }) => theme.breakpoint.mobileMax}) {
    grid-template-columns: 1fr;
    gap: 10px;
  }
`;

export const StatusDot = styled.div<{ $color: string }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${({ $color }) => $color};
`;

export const DiagnosisContainer = styled.div`
  background: rgba(0, 0, 0, 0.2);
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 10px;
`;

export const DiagnosisItem = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 0.85rem;
  margin-bottom: 8px;
`;

export const DiagnosisHeader = styled.div`
  display: flex;
  justify-content: space-between;

  @media (max-width: ${({ theme }) => theme.breakpoint.mobileMax}) {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
`;

export const DiagnosisKey = styled.span`
  text-transform: capitalize;
  font-weight: bold;
`;

export const DiagnosisValue = styled.div<{ $isSuccess: boolean }>`
  color: ${({ $isSuccess, theme }) => ($isSuccess ? "#52c41a" : "#ff4d4f")};
  display: inline-flex;
  align-items: center;
  gap: 6px;
`;

export const ProgressWrapper = styled.div`
  margin-bottom: 20px;
  width: 100%;
`;

export const DiagnosisDetails = styled.span`
  font-size: 0.75rem;
  opacity: 0.7;
  margin-top: 2px;
`;

export const LogItem = styled.div`
  margin-bottom: 10px;
  padding: 8px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
  font-size: 0.85rem;
`;

export const LogHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;

  @media (max-width: ${({ theme }) => theme.breakpoint.mobileMax}) {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
`;

export const LogTitle = styled.strong<{ $isError: boolean }>`
  color: ${({ $isError }) => ($isError ? "#ff4d4f" : "#52c41a")};
  display: flex;
  align-items: center;
  gap: 5px;
`;

export const LogDetails = styled.div`
  opacity: 0.8;
`;

export const LogStats = styled.div`
  font-size: 0.75rem;
  margin-top: 4px;
  opacity: 0.5;
`;

export const LogTimestamp = styled.span`
  font-size: 0.8rem;
  opacity: 0.5;
`;

export const LogDetailsText = styled.div`
  opacity: 0.8;
  font-size: 0.85rem;
  margin-top: 4px;
`;

export const LogStatsSeparator = styled.div`
  font-size: 0.75rem;
  margin-top: 6px;
  padding-top: 4px;
  opacity: 0.5;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
`;

export const StatsGridSuccess = styled(StatsGrid)`
  background: rgba(82, 196, 26, 0.1);
  border: 1px solid rgba(82, 196, 26, 0.2);
  margin-top: 15px;
  margin-bottom: 15px;
`;

export const CreditBreakdownRow = styled.div``;

export const StyledCommentBlock = styled(StyledSpan)`
  display: block;
  margin-top: 10px;
`;

export const InfoSpan = styled.span<{ $opacity?: number }>`
  opacity: ${({ $opacity }) => $opacity || 0.8};
`;

export const ActionButton = styled(Button)<{ $hasMarginTop?: boolean }>`
  width: auto;
  ${({ $hasMarginTop }) => $hasMarginTop && "margin-top: 8px;"}
`;

export const BillingPeriodText = styled.div`
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin-top: 4px;
  text-align: right;
`;

export const ProgressBarText = styled.span``;

export const CreditBreakdownContainer = styled.div`
  margin-top: 8px;
  margin-bottom: 16px;
  padding: 15px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  font-size: 0.85rem;
`;

export const CreditBreakdownTitle = styled.div`
  margin-bottom: 10px;
  font-weight: bold;
`;

export const CreditBreakdownGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px 20px;
  opacity: 0.8;

  @media (max-width: ${({ theme }) => theme.breakpoint.mobileMax}) {
    grid-template-columns: 1fr;
    gap: 10px;
  }
`;

export const CreditBreakdownValue = styled.span`
  color: var(--text-primary);
`;
