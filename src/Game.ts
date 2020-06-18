import { Board, DeadZone, Cell } from "./Board";
import "./Piece";
import { Player, PlayerType } from "./Player";
import { Lion } from "./Piece";
export class Game {
  private selectCell: Cell;
  private turn = 0;
  private currentPlayer = Player;
  private gameInfoEl = document.querySelector(".alert");
  private state: "STARED" | "ENDED" = "STARED";
  readonly upperPlayer = new Player(PlayerType.UPPER);
  readonly lowerPlayer = new Player(PlayerType.LOWER);
  readonly board = new Board(this.upperPlayer, this.lowerPlayer);
  readonly upperDeadZone = new DeadZone("upper");
  readonly lowerDeadZone = new DeadZone("lower");
  constructor() {
    const boardContainer = document.querySelector(".board-container");
    boardContainer.firstChild.remove();

    boardContainer.appendChild(this.board._el);
    this.currentPlayer = this.upperPlayer;
    this.board.render();
    this.renderInfo();

    this.board._el.addEventListener("click", (e) => {
      if (this.state === "END") {
        return false;
      }
      if (e.target instanceof HTMLElement) {
        let cellEl: HTMLElement;
        if (e.target.classList.contains("cell")) {
          cellEl = e.target;
        } else if (e.target.classList.contains("piece")) {
          cellEl = e.target.parentElement;
        } else {
          return false;
        }
        const cell = this.board.map.get(cellEl);
        if (this.isCurrentUserPiece(cell)) {
          this.select(cell);
          return false;
        }
        if (this.selectCell) {
          this.move(cell);
          this.changeTurn();
        }
      }
    });
  }
  select(cell: Cell) {
    if (cell.getPiece() == null) return;
    if (cell.getPiece().ownerType !== this.currentPlayer.type) return;
    if (this.selectCell) {
      this.selectCell.deactive();
      this.selectCell.render();
    }
    this.selectCell = cell;
    cell.active();
    cell.render();
  }
  isCurrentUserPiece(cell: Cell) {
    return (
      cell != null &&
      cell.getPiece() != null &&
      cell.getPiece().ownerType === this.currentPlayer.type
    );
  }
  move(cell: Cell) {
    this.selectCell.deactive();
    const killed = this.selectCell
      .getPiece()
      .move(this.selectCell, cell)
      .getKilled();
    this.selectCell = cell;
    if (killed) {
      if (killed.ownerType === PlayerType.UPPER) {
        this.lowerDeadZone.put(killed);
      } else {
        this.upperDeadZone.put(killed);
      }

      if (killed instanceof Lion) {
        this.state = "END";
      }
    }
  }
  renderInfo(extraMessage?: string) {
    this.gameInfoEl.innerHTML = `#${this.turn}턴 ${
      this.currentPlayer.type
    } 차례 ${extraMessage ? " | " + extraMessage : ""}`;
  }

  changeTurn() {
    this.selectCell.deactive();
    this.selectCell = null;
    if (this.state === "END") {
      this.renderInfo("END!");
    } else {
      this.turn += 1;
      this.currentPlayer =
        this.currentPlayer === this.lowerPlayer
          ? this.upperPlayer
          : this.lowerPlayer;
      this.renderInfo();
    }
    this.board.render();
  }
}
