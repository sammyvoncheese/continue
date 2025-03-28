import {
  ArrowTopRightOnSquareIcon,
  DocumentArrowUpIcon,
  TableCellsIcon,
} from "@heroicons/react/24/outline";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import DocsIndexingStatuses from "../../components/indexing/DocsIndexingStatuses";
import PageHeader from "../../components/PageHeader";
import { IdeMessengerContext } from "../../context/IdeMessenger";
import { useNavigationListener } from "../../hooks/useNavigationListener";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { setOnboardingCard } from "../../redux/slices/uiSlice";
import { saveCurrentSession } from "../../redux/thunks/session";
import { AccountButton } from "../config/AccountButton";
import IndexingProgress from "./IndexingProgress";
import KeyboardShortcuts from "./KeyboardShortcuts";
import MCPServersPreview from "./MCPServersPreview";
import MoreHelpRow from "./MoreHelpRow";
import { RulesPreview } from "./RulesPreview";

function MorePage() {
  useNavigationListener();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const ideMessenger = useContext(IdeMessengerContext);
  const config = useAppSelector((store) => store.config.config);
  const { disableIndexing } = config;

  return (
    <div className="overflow-y-scroll">
      <PageHeader
        showBorder
        onTitleClick={() => navigate("/")}
        title="Chat"
        rightContent={<AccountButton />}
      />

      <div className="gap-2 divide-x-0 divide-y-2 divide-solid divide-zinc-700 px-4">
        <div className="py-5">
          <div>
            <h3 className="mx-auto mb-1 mt-0 text-xl">@codebase index</h3>
            <span className="w-3/4 text-xs text-stone-500">
              Local embeddings of your codebase
            </span>
          </div>
          {disableIndexing ? (
            <div className="pb-2 pt-5">
              <p className="py-1 text-center font-semibold">
                Indexing is disabled
              </p>
              <p className="text-lightgray cursor-pointer text-center text-xs">
                Open settings and toggle <code>Disable Indexing</code> to
                re-enable
              </p>
            </div>
          ) : (
            <IndexingProgress />
          )}
        </div>

        <div className="flex flex-col py-5">
          <DocsIndexingStatuses />
        </div>

        <div className="flex flex-col py-5">
          <RulesPreview />
        </div>

        <div className="flex flex-col py-5">
          <MCPServersPreview />
        </div>

        <div className="py-5">
          <h3 className="mb-4 mt-0 text-xl">Help center</h3>
          <div className="-mx-4 flex flex-col">
            <MoreHelpRow
              title="Documentation"
              description="Learn how to configure and use Continue"
              Icon={ArrowTopRightOnSquareIcon}
              onClick={() =>
                ideMessenger.post("openUrl", "https://docs.continue.dev/")
              }
            />

            <MoreHelpRow
              title="Have an issue?"
              description="Let us know on GitHub and we'll do our best to resolve it"
              Icon={ArrowTopRightOnSquareIcon}
              onClick={() =>
                ideMessenger.post(
                  "openUrl",
                  "https://github.com/continuedev/continue/issues/new/choose",
                )
              }
            />

            <MoreHelpRow
              title="Join the community!"
              description="Join us on Discord to stay up-to-date on the latest developments"
              Icon={ArrowTopRightOnSquareIcon}
              onClick={() =>
                ideMessenger.post("openUrl", "https://discord.gg/vapESyrFmJ")
              }
            />

            <MoreHelpRow
              title="Token usage"
              description="Daily token usage across models"
              Icon={TableCellsIcon}
              onClick={() => navigate("/stats")}
            />

            <MoreHelpRow
              title="Quickstart"
              description="Reopen the quickstart and tutorial file"
              Icon={DocumentArrowUpIcon}
              onClick={async () => {
                navigate("/");
                // Used to clear the chat panel before showing onboarding card
                await dispatch(
                  saveCurrentSession({
                    openNewSession: true,
                    generateTitle: true,
                  }),
                );
                dispatch(setOnboardingCard({ show: true, activeTab: "Best" }));
                ideMessenger.post("showTutorial", undefined);
              }}
            />
          </div>
        </div>

        <div>
          <h3 className="mx-auto mb-1 text-lg">Keyboard shortcuts</h3>
          <KeyboardShortcuts />
        </div>
      </div>
    </div>
  );
}

export default MorePage;
