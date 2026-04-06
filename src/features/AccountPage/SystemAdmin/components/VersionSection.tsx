import React, { useEffect, useState } from "react";
import {
  TopBorderSection,
  SectionTitle,
  SubSectionContainer,
  StatsGridLarge,
  StatsRow,
  DiagnosisKey,
  DiagnosisValue,
} from "../styled";
import { APP_VERSION } from "../../../../version";

export const VersionSection = () => {
  const [swVersion, setSwVersion] = useState<string>("---");

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    const getVersion = async () => {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration && registration.active) {
        const worker = registration.active;

        const handler = (event: MessageEvent) => {
          if (event.data && event.data.type === "VERSION_INFO") {
            navigator.serviceWorker.removeEventListener("message", handler);
            setSwVersion(event.data.version);
          }
        };

        navigator.serviceWorker.addEventListener("message", handler);
        worker.postMessage({ type: "GET_VERSION" });

        // Backup timeout
        setTimeout(() => {
          navigator.serviceWorker.removeEventListener("message", handler);
        }, 2000);
      }
    };

    getVersion();
  }, []);

  return (
    <TopBorderSection $noBorder>
      <SectionTitle>Aplikacja i Zasoby</SectionTitle>
      <SubSectionContainer>
        <StatsGridLarge>
          <StatsRow $long>
            <DiagnosisKey>Wersja aplikacji:</DiagnosisKey>
            <DiagnosisValue $isSuccess={true}>{APP_VERSION}</DiagnosisValue>
          </StatsRow>
          <StatsRow $long>
            <DiagnosisKey>Identyfikator kompilacji (SW):</DiagnosisKey>
            <DiagnosisValue $isSuccess={swVersion !== "---"}>
              {swVersion}
            </DiagnosisValue>
          </StatsRow>
        </StatsGridLarge>
      </SubSectionContainer>
    </TopBorderSection>
  );
};
