import { AsyncPipe } from "@angular/common";
import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { FieldComponent } from "@home/components/field/field.component";
import { ProceduralComponent } from "@home/components/procedural/procedural.component";

@Component({
  selector: "app-layout",
  standalone: true,
  imports: [RouterOutlet, AsyncPipe, FieldComponent, ProceduralComponent],
  templateUrl: "./home-shell.component.html",
  styleUrl: "./home-shell.component.scss",
})
export class HomeShellComponent {}
